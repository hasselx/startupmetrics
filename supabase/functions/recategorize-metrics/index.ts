import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Valid category IDs
const VALID_CATEGORIES = [
  'financial-performance',
  'financial-health-risk',
  'unit-economics',
  'pricing-monetization',
  'valuation-investor',
  'growth-acquisition',
  'marketing-funnel',
  'sales-efficiency',
  'retention-engagement',
  'customer-success-support',
  'product-usage',
  'technology-engineering',
  'data-analytics',
  'saas-specific',
  'marketplace-platform',
  'operational-efficiency',
  'people-organizational',
  'compliance-governance',
  'fraud-trust',
  'partnerships',
  'brand-reputation',
  'impact-esg',
];

// Category descriptions for AI classification
const CATEGORY_DESCRIPTIONS = `
Categories (use exact ID):
- financial-performance: Revenue, profit, margins, cash flow, EBITDA, MRR, ARR core financial metrics
- financial-health-risk: Debt ratios, liquidity, runway, burn rate, working capital, risk assessment
- unit-economics: CAC, LTV, contribution margin, payback period, per-unit profitability
- pricing-monetization: Pricing strategies, ARPU, revenue per user, monetization metrics
- valuation-investor: Valuation multiples, cap tables, dilution, funding, investor metrics
- growth-acquisition: User growth, customer acquisition, growth rate, viral coefficients
- marketing-funnel: Conversion rates, funnel stages, lead metrics, attribution
- sales-efficiency: Sales velocity, win rates, deal size, quota attainment, sales productivity
- retention-engagement: Churn, retention rates, DAU/MAU, engagement, stickiness
- customer-success-support: NPS, CSAT, support tickets, response times, customer health
- product-usage: Feature adoption, active users, session metrics, product analytics
- technology-engineering: Code quality, uptime, latency, deployment frequency, tech debt
- data-analytics: Data quality, analytics metrics, BI metrics
- saas-specific: SaaS-specific metrics like MRR churn, expansion revenue, net revenue retention
- marketplace-platform: GMV, take rate, liquidity, platform-specific metrics
- operational-efficiency: Operational metrics, efficiency ratios, process metrics
- people-organizational: HR metrics, employee satisfaction, headcount, productivity
- compliance-governance: Regulatory compliance, audit metrics, governance
- fraud-trust: Fraud detection, trust scores, security metrics
- partnerships: Partner metrics, affiliate performance, channel metrics
- brand-reputation: Brand awareness, sentiment, reputation metrics
- impact-esg: ESG metrics, sustainability, social impact
`;

// Simple mapping for obvious old category IDs to new ones
const LEGACY_MAPPING: Record<string, string> = {
  'financial': 'financial-performance',
  'growth': 'growth-acquisition',
  'retention': 'retention-engagement',
  'product': 'product-usage',
  'marketing': 'marketing-funnel',
  'sales': 'sales-efficiency',
  'operational': 'operational-efficiency',
  'saas': 'saas-specific',
  'valuation': 'valuation-investor',
  'support': 'customer-success-support',
  'hr': 'people-organizational',
  'people': 'people-organizational',
  'technology': 'technology-engineering',
  'engineering': 'technology-engineering',
  'data': 'data-analytics',
  'analytics': 'data-analytics',
  'compliance': 'compliance-governance',
  'governance': 'compliance-governance',
  'fraud': 'fraud-trust',
  'trust': 'fraud-trust',
  'partnerships': 'partnerships',
  'partner': 'partnerships',
  'brand': 'brand-reputation',
  'reputation': 'brand-reputation',
  'esg': 'impact-esg',
  'impact': 'impact-esg',
  'marketplace': 'marketplace-platform',
  'platform': 'marketplace-platform',
  'pricing': 'pricing-monetization',
  'monetization': 'pricing-monetization',
};

async function classifyWithAI(title: string, definition: string): Promise<string | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not configured");
    return null;
  }

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a startup metrics classification expert. Given a metric title and definition, classify it into exactly one category. Return ONLY the category ID, nothing else.

${CATEGORY_DESCRIPTIONS}

IMPORTANT: Return ONLY the exact category ID from the list above. No explanations.`
          },
          {
            role: "user",
            content: `Classify this metric:\n\nTitle: ${title}\nDefinition: ${definition}`
          }
        ],
        max_tokens: 50,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error("AI classification failed:", response.status);
      return null;
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim().toLowerCase();
    
    // Validate the result is a valid category
    if (result && VALID_CATEGORIES.includes(result)) {
      return result;
    }
    
    console.log(`AI returned invalid category "${result}" for "${title}"`);
    return null;
  } catch (error) {
    console.error("AI classification error:", error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all metrics with invalid categories
    const { data: metrics, error: fetchError } = await supabase
      .from('metrics')
      .select('id, title, category, definition')
      .order('title');

    if (fetchError) {
      throw new Error(`Failed to fetch metrics: ${fetchError.message}`);
    }

    const results = {
      total: metrics?.length || 0,
      updated: 0,
      legacyMapped: 0,
      aiClassified: 0,
      failed: [] as { id: string; title: string; oldCategory: string }[],
    };

    for (const metric of metrics || []) {
      const currentCategory = metric.category?.toLowerCase().trim();
      
      // Skip if already valid
      if (VALID_CATEGORIES.includes(currentCategory)) {
        continue;
      }

      let newCategory: string | null = null;

      // Try legacy mapping first
      if (currentCategory && LEGACY_MAPPING[currentCategory]) {
        newCategory = LEGACY_MAPPING[currentCategory];
        results.legacyMapped++;
      } else {
        // Use AI classification
        newCategory = await classifyWithAI(metric.title, metric.definition);
        if (newCategory) {
          results.aiClassified++;
        }
      }

      if (newCategory) {
        const { error: updateError } = await supabase
          .from('metrics')
          .update({ category: newCategory })
          .eq('id', metric.id);

        if (updateError) {
          console.error(`Failed to update ${metric.title}:`, updateError);
          results.failed.push({ 
            id: metric.id, 
            title: metric.title, 
            oldCategory: metric.category 
          });
        } else {
          results.updated++;
          console.log(`Updated "${metric.title}": ${metric.category} -> ${newCategory}`);
        }
      } else {
        // Could not classify - add to failed list
        results.failed.push({ 
          id: metric.id, 
          title: metric.title, 
          oldCategory: metric.category 
        });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log("Recategorization complete:", results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Recategorize error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
