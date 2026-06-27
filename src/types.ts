/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  source: string;
  content: string;
  date: string;
  url: string;
  category: string;
  readTime: string;
  globalConnection: string;
  isBroken?: boolean;
}

export interface CategorySummary {
  summaryText: string;
  macroOutlook: string;
  localGlobalConnection: string;
}

export interface InDepthAnalysis {
  historicalContext: string;
  keyStakes: string;
  macroeconomicVariables: string[];
  glossary: { term: string; definition: string }[];
}

export type NewsCategory =
  | 'economy'
  | 'us_politics'
  | 'foreign_politics'
  | 'breaking'
  | 'innovations'
  | 'local'
  | 'weather';
