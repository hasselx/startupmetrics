import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform",
};

const CATEGORIES = [
  // Core Financial & Economics
  "financial-performance",
  "financial-health-risk",
  "unit-economics",
  "pricing-monetization",
  "valuation-investor",
  // Growth & Acquisition
  "growth-acquisition",
  "marketing-funnel",
  "sales-efficiency",
  // Retention & Engagement
  "retention-engagement",
  "customer-success-support",
  // Product & Technology
  "product-usage",
  "technology-engineering",
  "data-analytics",
  // Business Models
  "saas-specific",
  "marketplace-platform",
  // Operations & Organization
  "operational-efficiency",
  "people-organizational",
  // Governance & Compliance
  "compliance-governance",
  "fraud-trust",
  // Strategic
  "partnerships",
  "brand-reputation",
  "impact-esg",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's auth token to verify they're authenticated
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const token = authHeader.slice("Bearer ".length).trim();

    // NOTE: verify_jwt is disabled in config; validate JWT using signing keys via getClaims()
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: claimsData, error: claimsError } = await userSupabase.auth.getClaims(token);

    const userId = claimsData?.claims?.sub;
    if (claimsError || !userId) {
      console.error("Authentication failed:", claimsError?.message ?? "missing sub claim");
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Authenticated user: ${userId}`);

    const { query } = await req.json();
    
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "Query must be at least 2 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    // Use service role for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if metric already exists
    const slug = query.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const { data: existingMetric } = await supabase
      .from("metrics")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (existingMetric) {
      console.log(`Metric "${slug}" already exists, returning cached version`);
      return new Response(
        JSON.stringify({ metric: existingMetric, generated: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating new metric for: ${query}`);

    // Generate metric using Lovable AI with tool calling
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a startup metrics expert. Generate comprehensive, accurate metric definitions for startup and SaaS businesses. Always provide practical examples with real numbers.

CRITICAL RULE: The metric title MUST be EXACTLY the user's query. Do NOT expand, modify, or "improve" the title. If user asks for "Pivot", the title must be exactly "Pivot" - NOT "Pivot Rate", NOT "Pivot Success Ratio", just "Pivot".`,
          },
          {
            role: "user",
            content: `Generate a complete startup metric entry with the title exactly: "${query}"

IMPORTANT: The title field MUST be exactly "${query}" - do not change it, expand it, or add words to it.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_metric",
              description: "Create a startup metric entry with all required fields",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "MUST be exactly the user's query - do not modify or expand it",
                  },
                  category: {
                    type: "string",
                    enum: CATEGORIES,
                    description: "The category this metric belongs to",
                  },
                  definition: {
                    type: "string",
                    description: "A clear 1-3 sentence definition of what this metric measures",
                  },
                  formula: {
                    type: "string",
                    description: "The mathematical formula to calculate this metric",
                  },
                  visualization_type: {
                    type: "string",
                    enum: ["line", "bar", "funnel", "pie"],
                    description: "Best chart type to visualize this metric",
                  },
                  visualization_labels: {
                    type: "array",
                    items: { type: "string" },
                    description: "4-7 labels for the chart (e.g., months, quarters, stages)",
                  },
                  visualization_values: {
                    type: "array",
                    items: { type: "number" },
                    description: "Corresponding numeric values for the chart (realistic example data)",
                  },
                  example: {
                    type: "string",
                    description: "A practical example with specific numbers showing how to calculate this metric",
                  },
                  why_it_matters: {
                    type: "string",
                    description: "2-3 sentences explaining why startups should track this metric",
                  },
                },
                required: [
                  "title",
                  "category",
                  "definition",
                  "formula",
                  "visualization_type",
                  "visualization_labels",
                  "visualization_values",
                  "example",
                  "why_it_matters",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_metric" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "AI service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("Failed to generate metric");
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    // Extract the tool call arguments
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(aiData));
      throw new Error("Invalid AI response format");
    }

    const metricData = JSON.parse(toolCall.function.arguments);
    console.log("Parsed metric data:", metricData.title);

    // Validate required fields
    const requiredFields = ["title", "category", "definition", "formula", "example", "why_it_matters"];
    for (const field of requiredFields) {
      if (!metricData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // CRITICAL: Override AI title with exact user query to enforce strict matching
    const exactTitle = query.trim();
    console.log(`Enforcing exact title: "${exactTitle}" (AI suggested: "${metricData.title}")`);
    
    // Generate slug from exact user query
    const titleSlug = exactTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    // Create the metric object
    const newMetric = {
      title: exactTitle, // Use exact user query, NOT AI-generated title
      slug: titleSlug,
      category: metricData.category || "financial",
      definition: metricData.definition,
      formula: metricData.formula,
      visualization_type: metricData.visualization_type || "bar",
      visualization_data: {
        labels: metricData.visualization_labels || ["Q1", "Q2", "Q3", "Q4"],
        values: metricData.visualization_values || [100, 150, 200, 250],
      },
      example: metricData.example,
      why_it_matters: metricData.why_it_matters,
      source: "ai",
    };

    // Insert into database
    const { data: insertedMetric, error: insertError } = await supabase
      .from("metrics")
      .insert(newMetric)
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      // If duplicate, try to fetch existing
      if (insertError.code === "23505") {
        const { data: existing } = await supabase
          .from("metrics")
          .select("*")
          .eq("slug", titleSlug)
          .single();
        if (existing) {
          return new Response(
            JSON.stringify({ metric: existing, generated: false }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      throw new Error("Failed to save metric");
    }

    console.log(`Successfully created metric: ${insertedMetric.title}`);

    return new Response(
      JSON.stringify({ metric: insertedMetric, generated: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate metric error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate metric" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
