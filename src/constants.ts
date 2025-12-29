import { Question, ToolComponent, SystemBlueprint, UserAnswers, SystemStep } from './types';
import { 
  Users, 
  Megaphone, 
  Calendar, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Mail, 
  MessageSquare,
  Globe, 
  Zap,
  Clock,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';

// --- STAGE 1: FOUNDATION ---
export const STAGE_1_QUESTIONS: Question[] = [
  {
    id: 'businessType',
    title: 'What type of business are you building?',
    subtitle: 'This defines the core structure of your funnel.',
    options: [
      { id: 'agency', label: 'Marketing Agency', value: 'agency', description: 'SMMA, SEO, Content', icon: BarChart3 },
      { id: 'coaching', label: 'Coaching / Consulting', value: 'coaching', description: 'Education, Mentorship', icon: Users },
      { id: 'local_service', label: 'Local Service', value: 'local_service', description: 'Gym, Dentist, HVAC, Real Estate', icon: Globe },
      { id: 'other', label: 'Other / Professional', value: 'other', description: 'Legal, Financial, SaaS', icon: FileText },
    ]
  },
  {
    id: 'leadSource',
    title: 'How do you primarily generate attention?',
    subtitle: 'Your intake mechanism determines the first step.',
    options: [
      { id: 'paid_ads', label: 'Paid Advertising', value: 'paid_ads', description: 'Facebook, Google, YouTube Ads', icon: Megaphone },
      { id: 'organic', label: 'Organic Content', value: 'organic_content', description: 'Social Media, SEO, Blogging', icon: Users },
      { id: 'outbound', label: 'Outbound Prospecting', value: 'outbound', description: 'Cold Email, DM Outreach', icon: Mail },
      { id: 'referral', label: 'Referrals / Networking', value: 'referral', description: 'Word of Mouth, Partnerships', icon: UserCheck },
    ]
  },
  {
    id: 'salesModel',
    title: 'How does a lead become a customer?',
    subtitle: 'This defines the conversion mechanism.',
    options: [
      { id: 'appointments', label: 'Appointments / Calls', value: 'appointments', description: 'Booked on a calendar', icon: Calendar },
      { id: 'direct', label: 'Direct Purchase', value: 'direct_purchase', description: 'Low ticket, courses, e-commerce', icon: CreditCard },
      { id: 'invoicing', label: 'Manual Invoicing', value: 'invoicing', description: 'Proposals and contracts', icon: FileText },
    ]
  }
];

// --- STAGE 2: BEHAVIORAL ---
export const STAGE_2_QUESTIONS: Question[] = [
  {
    id: 'leadLossReason',
    title: 'What usually causes you to lose leads?',
    subtitle: 'Be honest—this helps us plug the leak.',
    options: [
      { id: 'slow_response', label: 'Slow Response Time', value: 'slow_response', description: 'They buy elsewhere before I reply', icon: Clock },
      { id: 'no_followup', label: 'Lack of Follow-up', value: 'no_followup', description: 'I forget to check in after the first call', icon: Activity },
      { id: 'low_trust', label: 'Low Trust / Skepticism', value: 'low_trust', description: 'They don\'t believe the promise yet', icon: ShieldAlert },
      { id: 'price', label: 'Price / Urgency', value: 'price_urgency', description: 'They "need to think about it"', icon: CreditCard },
    ]
  },
  {
    id: 'leadBehavior',
    title: 'How do leads usually behave after contact?',
    subtitle: 'This determines your automation intensity.',
    options: [
      { id: 'ghosting', label: 'They Often Ghost', value: 'ghosting', description: 'Radio silence after one message', icon: MessageSquare },
      { id: 'questions', label: 'Ask Many Questions', value: 'questions', description: 'Need lots of education before buying', icon: HelpCircle },
      { id: 'ready', label: 'Ready to Go', value: 'ready', description: 'Action-oriented (rare)', icon: Zap },
      { id: 'reminders', label: 'Need Reminders', value: 'reminders', description: 'Interested but busy/forgetful', icon: Clock },
    ]
  },
  {
    id: 'leadTiming',
    title: 'When do most new leads arrive?',
    options: [
      { id: 'business_hours', label: 'Business Hours', value: 'business_hours', description: '9am - 5pm', icon: Calendar },
      { id: 'after_hours', label: 'Nights & Weekends', value: 'after_hours', description: 'When you are sleeping', icon: Globe },
      { id: 'mixed', label: 'Unpredictable', value: 'mixed', description: 'Any time of day', icon: Activity },
    ]
  },
  {
    id: 'priority',
    title: 'What is your top priority right now?',
    options: [
      { id: 'capture', label: 'Never Miss a Lead', value: 'capture', description: 'Fix the leaky bucket', icon: ShieldAlert },
      { id: 'simplicity', label: 'Simplicity', value: 'simplicity', description: 'I hate complex tech', icon: Zap },
      { id: 'time', label: 'Saving Time', value: 'time', description: 'I want to automate busy work', icon: Clock },
      { id: 'scale', label: 'Scaling Up', value: 'scale', description: 'Prepare for volume', icon: TrendingUp },
    ]
  }
];

export const ALL_QUESTIONS = [...STAGE_1_QUESTIONS, ...STAGE_2_QUESTIONS];

// --- MARKET DATA (For Comparison) ---
export const MARKET_STACK_DATA = [
  {
    category: "CRM / Pipeline",
    examples: ["Pipedrive ($15/u)", "HubSpot ($45+)", "Salesmate ($23/u)", "Insightly ($29/u)", "Keap ($249)"],
    avgCost: 45
  },
  {
    category: "Lead Capture / Funnels",
    examples: ["ClickFunnels ($97)", "Systeme.io ($27+)", "Webflow ($18)", "Typeform ($25)"],
    avgCost: 97
  },
  {
    category: "Appointment Scheduling",
    examples: ["Calendly ($12-16)", "Acuity ($16)"],
    avgCost: 15
  },
  {
    category: "Email & SMS Marketing",
    examples: ["ActiveCampaign ($29-149)", "Mailchimp ($20+)", "Twilio (usage)"],
    avgCost: 49
  },
  {
    category: "Reputation / Reviews",
    examples: ["Podium ($289+)", "Birdeye ($299+)"],
    avgCost: 150
  }
];

// --- LOGIC ENGINE ---

export const generateBlueprint = (answers: UserAnswers): SystemBlueprint => {
  const salesModel = answers['salesModel'];
  const leadSource = answers['leadSource'];
  const leadLossReason = answers['leadLossReason'];
  const leadBehavior = answers['leadBehavior'];
  const leadTiming = answers['leadTiming'];
  const priority = answers['priority'];

  const steps: SystemStep[] = [];

  // --- STEP 1: INTAKE & CAPTURE ---
  if (leadSource === 'paid_ads') {
    steps.push({
      id: 'intake',
      title: 'High-Intent Landing Page',
      description: 'A dedicated funnel page, not your home page.',
      reason: 'Paid traffic converts poorly on general websites. You need distraction-free capture.',
      type: 'intake'
    });
  } else if (leadSource === 'outbound') {
    steps.push({
      id: 'intake',
      title: 'Cold Prospect List & Enrich',
      description: 'Scraping and verifying prospect data.',
      reason: 'Since you are doing outbound, you need clean data to avoid spam filters.',
      type: 'intake'
    });
  } else if (leadSource === 'referral') {
    steps.push({
      id: 'intake',
      title: 'Partner Referral Portal',
      description: 'A simple link for partners to register leads.',
      reason: 'Reduce friction for your referral partners to send you business.',
      type: 'intake'
    });
  } else {
    steps.push({
      id: 'intake',
      title: 'Content Opt-in / Lead Magnet',
      description: 'Exchange value (PDF/Video) for contact info.',
      reason: 'Organic traffic needs a compelling reason to subscribe before they buy.',
      type: 'intake'
    });
  }

  // --- STEP 2: IMMEDIATE RESPONSE (Behavioral) ---
  const needsSpeed = leadLossReason === 'slow_response' || leadTiming === 'after_hours' || leadTiming === 'mixed' || priority === 'capture';

  if (needsSpeed) {
    steps.push({
      id: 'speed_lead',
      title: 'Missed Call Text Back / Auto-SMS',
      description: 'System automatically texts leads within 2 minutes.',
      reason: 'You indicated leads are lost due to timing/slowness. Speed-to-lead increases conversion by 391%.',
      type: 'action'
    });
  } else if (leadBehavior === 'questions') {
    steps.push({
      id: 'education',
      title: 'FAQ Auto-Responder',
      description: 'Instant email with "What to Expect" guide.',
      reason: 'Since your leads ask many questions, answer the top 5 automatically before you get on a call.',
      type: 'action'
    });
  } else {
    steps.push({
      id: 'ack',
      title: 'Personalized Acknowledgment',
      description: 'Automated "I got your request" email.',
      reason: 'A simple confirmation establishes trust and sets expectations.',
      type: 'action'
    });
  }

  // --- STEP 3: NURTURE & FOLLOW UP (Behavioral) ---
  if (leadBehavior === 'ghosting' || leadLossReason === 'no_followup') {
    steps.push({
      id: 'nurture_heavy',
      title: 'Multi-Channel Reactivation',
      description: 'Day 1, 2, 3, 7, 14 sequence via SMS & Email.',
      reason: 'To combat ghosting, you need aggressive (but polite) persistence across multiple channels.',
      type: 'nurture'
    });
  } else if (leadLossReason === 'low_trust') {
    steps.push({
      id: 'nurture_trust',
      title: 'Social Proof Drip Sequence',
      description: 'Send case studies and testimonials automatically.',
      reason: 'Your leads are skeptical. Don\'t sell; show them results from others.',
      type: 'nurture'
    });
  } else {
    steps.push({
      id: 'nurture_std',
      title: 'Value-First Newsletter Drip',
      description: 'Weekly value adds to keep top of mind.',
      reason: 'Standard nurture to maintain the relationship until they are ready to buy.',
      type: 'nurture'
    });
  }

  // --- STEP 4: CONVERSION (Sales Model) ---
  if (salesModel === 'appointments') {
    if (leadBehavior === 'reminders') {
      steps.push({
        id: 'conversion_appt_remind',
        title: 'Booking + Attendance Reminders',
        description: 'Calendar link + 24h/1h/10min reminders.',
        reason: 'Your leads tend to forget. Automated reminders will drastically reduce no-show rates.',
        type: 'conversion'
      });
    } else {
      steps.push({
        id: 'conversion_appt',
        title: 'Automated Calendar Booking',
        description: 'Self-serve scheduling link.',
        reason: 'Eliminate the "when are you free?" email ping-pong.',
        type: 'conversion'
      });
    }
  } else if (salesModel === 'direct_purchase') {
    steps.push({
      id: 'conversion_checkout',
      title: 'Sales Page & One-Click Upsell',
      description: 'Cart with order bumps to increase AOV.',
      reason: 'Maximize immediate transaction value without manual intervention.',
      type: 'conversion'
    });
    steps.push({
      id: 'retention_cart',
      title: 'Cart Abandonment Recovery',
      description: 'Auto-email when they leave checkout.',
      reason: 'Recover 10-20% of lost sales automatically.',
      type: 'retention'
    });
  } else {
    steps.push({
      id: 'conversion_invoice',
      title: 'Proposal & E-Sign Automation',
      description: 'Track when proposals are opened.',
      reason: 'Know exactly when to follow up on sent contracts based on user activity.',
      type: 'conversion'
    });
  }

  // --- STEP 5: RETENTION / POST-SALE ---
  if (priority === 'scale' || answers.businessType === 'local_service') {
    steps.push({
      id: 'referral_auto',
      title: 'Review Request Automation',
      description: 'Ask for Google Review after successful delivery.',
      reason: 'Fuel your scaling with organic reputation. It\'s the cheapest lead source.',
      type: 'retention'
    });
  }

  // --- TOOLS ---
  const requiredTools: ToolComponent[] = [];

  // Filter based on needs
  requiredTools.push({
    name: 'Pipeline CRM',
    category: 'core',
    avgCost: MARKET_STACK_DATA[0].avgCost,
    description: 'To track deals.',
    examples: MARKET_STACK_DATA[0].examples.join(', '),
    isRequired: true
  }); 

  requiredTools.push({
    name: 'Funnel Builder',
    category: 'conversion',
    avgCost: MARKET_STACK_DATA[1].avgCost,
    description: 'To capture leads.',
    examples: MARKET_STACK_DATA[1].examples.join(', '),
    isRequired: true
  });

  requiredTools.push({
    name: 'Email/SMS',
    category: 'automation',
    avgCost: MARKET_STACK_DATA[3].avgCost,
    description: 'To nurture leads.',
    examples: MARKET_STACK_DATA[3].examples.join(', '),
    isRequired: true
  });

  if (salesModel === 'appointments') {
    requiredTools.push({
      name: 'Scheduling',
      category: 'conversion',
      avgCost: MARKET_STACK_DATA[2].avgCost,
      description: 'To book calls.',
      examples: MARKET_STACK_DATA[2].examples.join(', '),
      isRequired: true
    });
  }
  
  if (priority === 'scale' || answers.businessType === 'local_service') {
    requiredTools.push({
      name: 'Reputation',
      category: 'retention',
      avgCost: MARKET_STACK_DATA[4].avgCost,
      description: 'To get reviews.',
      examples: MARKET_STACK_DATA[4].examples.join(', '),
      isRequired: false
    });
  }

  return {
    title: 'Your Behavioral Acquisition System',
    description: 'This blueprint is not a template. It is adapted to your specific lead handling constraints and growth goals.',
    steps,
    requiredTools,
    commonMistakes: [
      'Buying tools before mapping the journey',
      'Separating the CRM from the Email tool (causes data silos)',
      'Manually following up instead of using automation',
      'Not having a unified inbox for SMS, Email, and Social DM'
    ]
  };
};

export const GHL_COMPARISON = {
  price: 97,
  name: 'GoHighLevel',
  features: [
    'Unlimited Landing Pages',
    'Built-in Pipeline CRM',
    'Email & SMS Automation',
    'Calendar Scheduling',
    'Forms & Surveys',
    'Reputation Management',
    'Membership Areas'
  ]
};