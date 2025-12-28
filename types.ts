import React from 'react';

export type SalesModel = 'appointments' | 'direct_purchase' | 'invoicing';
export type LeadSource = 'paid_ads' | 'organic_content' | 'outbound' | 'referral';
export type BusinessType = 'agency' | 'coaching' | 'local_service' | 'saas' | 'other';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: React.ComponentType<any>;
}

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
}

export interface UserAnswers {
  [key: string]: string;
}

export interface ToolComponent {
  name: string;
  category: 'core' | 'automation' | 'conversion' | 'retention';
  avgCost: number;
  description: string;
  examples: string;
  isRequired: boolean;
}

export interface SystemStep {
  id: string;
  title: string;
  description: string;
  reason: string;
  type: 'intake' | 'action' | 'nurture' | 'conversion' | 'retention';
}

export interface SystemBlueprint {
  title: string;
  description: string;
  steps: SystemStep[];
  requiredTools: ToolComponent[];
  commonMistakes: string[];
}