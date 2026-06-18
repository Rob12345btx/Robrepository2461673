/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Globe, TrendingUp, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { CategorySummary, NewsCategory } from '../types';

interface SummaryCardProps {
  summary: CategorySummary;
  category: NewsCategory;
  location: string;
}

export default function SummaryCard({ summary, category, location }: SummaryCardProps) {
  const getCategoryTitle = (cat: NewsCategory) => {
    switch (cat) {
      case 'economy':
        return 'General Macroeconomics';
      case 'us_politics':
        return 'US Legislative Trends & Fiscal Policy';
      case 'foreign_politics':
        return 'Global Alliances & Tariffs';
      case 'breaking':
        return 'Active Global Disruptions';
      case 'innovations':
        return 'Industrial Shifts & Innovations';
      case 'local':
        return `Local Intelligence: ${location}`;
      case 'weather':
        return 'Climate Macroeconomics & Commodities';
      default:
        return 'World & Economic Affairs';
    }
  };

  const getTopicIcon = (cat: NewsCategory) => {
    switch (cat) {
      case 'innovations':
        return <Cpu className="w-5 h-5 text-amber-600" />;
      case 'economy':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'local':
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
      default:
        return <Globe className="w-5 h-5 text-neutral-700" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-stone-50 border border-stone-200 rounded-xl p-5 mb-8 shadow-sm flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch"
    >
      {/* Category Summary Header & Text */}
      <div className="md:col-span-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {getTopicIcon(category)}
            <h2 className="font-serif text-lg font-bold text-neutral-800 tracking-tight">
              {getCategoryTitle(category)} Briefing
            </h2>
          </div>
          <p className="font-serif text-sm text-neutral-700 leading-relaxed indent-4">
            {summary.summaryText ||
              "Synthesizing recent intelligence indices... Please wait as EconWorld retrieves recent grounded files."}
          </p>
        </div>

        {summary.macroOutlook && (
          <div className="mt-4 pt-4 border-t border-stone-200 flex flex-wrap gap-2 items-center text-xs text-neutral-600">
            <span className="font-mono uppercase font-bold text-[10px] text-stone-500 tracking-wider">
              Macro Outlook:
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-150">
              {summary.macroOutlook}
            </span>
          </div>
        )}
      </div>

      {/* Connection Panel - Highlights Local to Global Connections */}
      <div className="md:col-span-5 bg-white border border-stone-200/80 rounded-lg p-4.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-mono tracking-wider font-bold text-indigo-800 uppercase bg-indigo-50/50 w-fit px-2 py-0.5 rounded">
            <Globe className="w-3.5 h-3.5" />
            Local-To-Global Connection Bridge
          </div>
          <h3 className="font-sans text-xs font-bold text-neutral-800 mb-1.5 uppercase tracking-wide">
            {category === 'local' ? 'Hometown Impact Matrix' : 'Regional Transmission Link'}
          </h3>
          <p className="font-sans text-xs text-neutral-600 leading-relaxed">
            {summary.localGlobalConnection ||
              "Establishing correlations between localized developments and worldwide supply structures..."}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-neutral-100 pt-2.5">
          <span>SOURCE: GEMINI-3.5 SYNTHESIS</span>
          <span className="font-semibold text-emerald-600">VERIFIED NO ADS</span>
        </div>
      </div>
    </motion.div>
  );
}
