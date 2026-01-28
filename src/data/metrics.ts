export interface Metric {
  id: string;
  title: string;
  slug: string;
  category: string;
  definition: string;
  formula: string;
  visualizationType: 'line' | 'bar' | 'funnel' | 'pie';
  visualizationData: {
    labels: string[];
    values: number[];
  };
  example: string;
  whyItMatters: string;
  source: 'human' | 'ai';
  createdAt: string;
}

export const categories = [
  // Core Financial & Economics
  { id: 'financial-performance', name: 'Financial Performance', icon: '💰', color: 'hsl(168, 80%, 32%)' },
  { id: 'financial-health-risk', name: 'Financial Health & Risk', icon: '🏦', color: 'hsl(175, 70%, 35%)' },
  { id: 'unit-economics', name: 'Unit Economics', icon: '⚖️', color: 'hsl(280, 70%, 50%)' },
  { id: 'pricing-monetization', name: 'Pricing & Monetization', icon: '💵', color: 'hsl(140, 70%, 40%)' },
  { id: 'valuation-investor', name: 'Valuation & Investor', icon: '💎', color: 'hsl(300, 70%, 50%)' },
  
  // Growth & Acquisition
  { id: 'growth-acquisition', name: 'Growth & Acquisition', icon: '📈', color: 'hsl(262, 80%, 50%)' },
  { id: 'marketing-funnel', name: 'Marketing & Funnel', icon: '📣', color: 'hsl(30, 80%, 50%)' },
  { id: 'sales-efficiency', name: 'Sales Efficiency', icon: '🎯', color: 'hsl(150, 80%, 40%)' },
  
  // Retention & Engagement
  { id: 'retention-engagement', name: 'Retention & Engagement', icon: '🔄', color: 'hsl(340, 80%, 50%)' },
  { id: 'customer-success-support', name: 'Customer Success & Support', icon: '🤝', color: 'hsl(190, 70%, 45%)' },
  
  // Product & Technology
  { id: 'product-usage', name: 'Product & Usage', icon: '📦', color: 'hsl(200, 80%, 50%)' },
  { id: 'technology-engineering', name: 'Technology & Engineering', icon: '🔧', color: 'hsl(210, 75%, 45%)' },
  { id: 'data-analytics', name: 'Data & Analytics', icon: '📊', color: 'hsl(230, 70%, 55%)' },
  
  // Business Models
  { id: 'saas-specific', name: 'SaaS-Specific', icon: '☁️', color: 'hsl(220, 80%, 50%)' },
  { id: 'marketplace-platform', name: 'Marketplace & Platform', icon: '🏪', color: 'hsl(25, 75%, 50%)' },
  
  // Operations & Organization
  { id: 'operational-efficiency', name: 'Operational Efficiency', icon: '⚙️', color: 'hsl(45, 80%, 50%)' },
  { id: 'people-organizational', name: 'People & Organizational', icon: '👥', color: 'hsl(320, 65%, 50%)' },
  
  // Governance & Compliance
  { id: 'compliance-governance', name: 'Compliance & Governance', icon: '📋', color: 'hsl(180, 60%, 40%)' },
  { id: 'fraud-trust', name: 'Fraud & Trust', icon: '🛡️', color: 'hsl(0, 70%, 50%)' },
  
  // Strategic
  { id: 'partnerships', name: 'Partnerships', icon: '🤲', color: 'hsl(270, 60%, 55%)' },
  { id: 'brand-reputation', name: 'Brand & Reputation', icon: '⭐', color: 'hsl(50, 85%, 50%)' },
  { id: 'impact-esg', name: 'Impact & ESG', icon: '🌱', color: 'hsl(120, 70%, 40%)' },
];

export const sampleMetrics: Metric[] = [
  {
    id: '1',
    title: 'Monthly Recurring Revenue',
    slug: 'mrr',
    category: 'financial',
    definition: 'Monthly Recurring Revenue (MRR) is the predictable revenue a company expects to receive every month from active subscriptions.',
    formula: 'MRR = Sum of all monthly subscription fees',
    visualizationType: 'line',
    visualizationData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [50000, 58000, 67000, 75000, 88000, 102000],
    },
    example: 'If you have 100 customers paying $50/month and 50 customers paying $100/month, your MRR = (100 x $50) + (50 x $100) = $10,000.',
    whyItMatters: 'MRR provides a clear picture of your recurring revenue stream and helps predict future cash flow, making it essential for SaaS companies to track growth and sustainability.',
    source: 'human',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Customer Acquisition Cost',
    slug: 'cac',
    category: 'marketing',
    definition: 'Customer Acquisition Cost (CAC) is the total cost of acquiring a new customer, including all marketing and sales expenses.',
    formula: 'CAC = Total Sales & Marketing Costs / Number of New Customers Acquired',
    visualizationType: 'bar',
    visualizationData: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      values: [150, 135, 120, 110],
    },
    example: 'If you spent $50,000 on marketing and sales in a month and acquired 100 new customers, your CAC = $50,000 / 100 = $500.',
    whyItMatters: 'Understanding CAC helps you evaluate marketing efficiency and ensure you are not spending more to acquire customers than they are worth over their lifetime.',
    source: 'human',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    title: 'Customer Lifetime Value',
    slug: 'ltv',
    category: 'unit-economics',
    definition: 'Customer Lifetime Value (LTV) is the total revenue a business can expect from a single customer account throughout their relationship.',
    formula: 'LTV = Average Revenue Per User x Average Customer Lifespan',
    visualizationType: 'bar',
    visualizationData: {
      labels: ['Basic', 'Pro', 'Enterprise'],
      values: [1200, 3600, 12000],
    },
    example: 'If customers pay $100/month on average and stay for 24 months, LTV = $100 x 24 = $2,400.',
    whyItMatters: 'LTV helps determine how much you can afford to spend on customer acquisition and which customer segments are most valuable to your business.',
    source: 'human',
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    title: 'Churn Rate',
    slug: 'churn-rate',
    category: 'retention',
    definition: 'Churn Rate measures the percentage of customers who stop using your product or service during a given time period.',
    formula: 'Churn Rate = (Customers Lost During Period / Customers at Start of Period) x 100',
    visualizationType: 'line',
    visualizationData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [5.2, 4.8, 4.5, 4.2, 3.9, 3.5],
    },
    example: 'If you started the month with 1,000 customers and lost 50, your monthly churn rate = (50 / 1,000) x 100 = 5%.',
    whyItMatters: 'High churn erodes growth and increases the burden on acquisition. Reducing churn is often more cost-effective than acquiring new customers.',
    source: 'human',
    createdAt: '2024-01-15',
  },
  {
    id: '5',
    title: 'Net Promoter Score',
    slug: 'nps',
    category: 'product',
    definition: 'Net Promoter Score (NPS) measures customer loyalty by asking how likely they are to recommend your product on a scale of 0-10.',
    formula: 'NPS = % Promoters (9-10) - % Detractors (0-6)',
    visualizationType: 'bar',
    visualizationData: {
      labels: ['Detractors', 'Passives', 'Promoters'],
      values: [15, 25, 60],
    },
    example: 'If 60% of respondents are promoters and 15% are detractors, NPS = 60 - 15 = 45.',
    whyItMatters: 'NPS is a leading indicator of growth. Companies with high NPS tend to have stronger word-of-mouth and organic growth.',
    source: 'human',
    createdAt: '2024-01-15',
  },
  {
    id: '6',
    title: 'Annual Recurring Revenue',
    slug: 'arr',
    category: 'saas',
    definition: 'Annual Recurring Revenue (ARR) is the yearly value of recurring revenue from subscriptions, normalized to a one-year period.',
    formula: 'ARR = MRR x 12',
    visualizationType: 'line',
    visualizationData: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      values: [500000, 850000, 1400000, 2200000, 3500000],
    },
    example: 'If your MRR is $100,000, your ARR = $100,000 x 12 = $1,200,000.',
    whyItMatters: 'ARR is the standard metric for SaaS valuation and helps investors and stakeholders understand the company revenue trajectory.',
    source: 'human',
    createdAt: '2024-01-15',
  },
  {
    id: '7',
    title: 'Conversion Rate',
    slug: 'conversion-rate',
    category: 'marketing',
    definition: 'Conversion Rate measures the percentage of visitors who complete a desired action, such as signing up or making a purchase.',
    formula: 'Conversion Rate = (Number of Conversions / Total Visitors) x 100',
    visualizationType: 'funnel',
    visualizationData: {
      labels: ['Visitors', 'Sign-ups', 'Trials', 'Customers'],
      values: [10000, 1500, 600, 180],
    },
    example: 'If 1,000 people visit your site and 50 sign up, your conversion rate = (50 / 1,000) x 100 = 5%.',
    whyItMatters: 'Conversion rate optimization directly impacts growth efficiency. Small improvements can significantly reduce acquisition costs.',
    source: 'human',
    createdAt: '2024-01-15',
  },
  {
    id: '8',
    title: 'Daily Active Users',
    slug: 'dau',
    category: 'product',
    definition: 'Daily Active Users (DAU) is the count of unique users who engage with your product within a 24-hour period.',
    formula: 'DAU = Count of unique users active in a day',
    visualizationType: 'line',
    visualizationData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [12500, 13200, 14100, 13800, 12900, 8500, 7200],
    },
    example: 'If 15,000 unique users log in and perform at least one action on Tuesday, your DAU for Tuesday = 15,000.',
    whyItMatters: 'DAU indicates product stickiness and user engagement. Tracking DAU trends helps identify growth patterns and potential issues.',
    source: 'human',
    createdAt: '2024-01-15',
  },
];
