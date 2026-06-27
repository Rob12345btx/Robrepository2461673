/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  BookOpen,
  History,
  Users,
  ShieldCheck,
  Award,
  ChevronDown,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsArticle, InDepthAnalysis } from '../types';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  location: string;
}

const REASSURING_MESSAGES = [
  "Retrieving historical trade logs (2010 - 2026)...",
  "Correlating regional employment arrays with central bank targets...",
  "Consulting academic finance dictionaries...",
  "Cross-referencing global yield trends with G20 import frameworks...",
  "Mapping systemic dependencies and fiscal variables..."
];

export default function ArticleModal({ article, onClose, location }: ArticleModalProps) {
  const [inDepth, setInDepth] = useState<InDepthAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  if (!article) return null;

  // Cycle through reassuring loading messages to make the analysis wait engaging
  const triggerMessageInterval = () => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % REASSURING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  };

  const loadInDepthAnalysis = async () => {
    setLoadingAnalysis(true);
    setMsgIdx(0);
    const stopInterval = triggerMessageInterval();

    try {
      const response = await fetch('/api/news/in-depth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          title: article.title,
          content: article.content,
          location: location,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInDepth(data);
      } else {
        throw new Error("Failed to pull analytical index");
      }
    } catch (err) {
      console.error(err);
    } finally {
      stopInterval();
      setLoadingAnalysis(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden select-none">
        
        {/* Outer background click to close */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-stone-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 z-10"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Ad-Free Reading Room
            </div>
            <button
              onClick={onClose}
              className="p-1 px-1.5 rounded-full hover:bg-stone-150 text-neutral-500 hover:text-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            
            {/* Newspaper style header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-stone-200 pb-6">
              <div className="flex items-center justify-center gap-3 text-xs text-neutral-500 font-sans tracking-wide">
                <span className="font-semibold text-neutral-700 bg-stone-200 px-2 py-0.5 rounded uppercase text-[10px]">
                  {article.source}
                </span>
                <span>•</span>
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                {article.title}
              </h2>

              <p className="font-serif text-lg text-neutral-600 leading-normal italic font-semibold">
                "{article.subtitle}"
              </p>
            </div>

            {/* Immersive Article Content */}
            <article className="max-w-2xl mx-auto font-serif text-neutral-850 text-base md:text-lg leading-relaxed space-y-6">
              {article.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="indent-6 first-of-type:indent-0">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Geographic & Global Connection Alert Box */}
            <div className="max-w-2xl mx-auto bg-stone-100 border-l-4 border-emerald-500 rounded-r-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4.5 h-4.5 text-emerald-700 animate-pulse" />
                <h4 className="font-sans text-xs font-black uppercase text-neutral-850 tracking-wider">
                  Macroscopic Connection Analysis
                </h4>
              </div>
              <p className="font-serif text-sm text-neutral-700 leading-relaxed italic">
                {article.globalConnection}
              </p>
            </div>

            {/* Article Citations Footer */}
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200 pt-5 text-xs text-neutral-500 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-semibold text-neutral-700">Direct Verified Deep Link:</span>
                </div>
                {article.isBroken ? (
                  <span className="inline-flex items-center gap-1.5 text-stone-500 bg-stone-200/50 px-2.5 py-1 rounded border border-stone-300 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
                    <span>Article unavailable or moved</span>
                  </span>
                ) : (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    referrerPolicy="no-referrer"
                    className="text-emerald-800 hover:text-emerald-950 font-semibold inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded border border-emerald-200/60 transition"
                    title={article.url}
                  >
                    <span>Read full piece on {article.source}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] text-neutral-400">
                  STRICTLY UNSUBVENTED • ZERO INCENTIVIZED ADS
                </span>
                {!article.isBroken && (
                  <span className="font-mono text-[9px] text-neutral-400 max-w-[200px] truncate" title={article.url}>
                    {article.url}
                  </span>
                )}
              </div>
            </div>

            {/* -------------------------------------------------------------
                IN-DEPTH CORRIDOR SECTION
                ------------------------------------------------------------- */}
            <div className="border-t-2 border-dashed border-stone-300 pt-8 max-w-2xl mx-auto">
              {!inDepth && !loadingAnalysis && (
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="mb-3.5 p-3 rounded-full bg-emerald-50 border border-emerald-150">
                    <BookOpen className="w-6 h-6 text-emerald-700 animate-bounce" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-neutral-800">
                    Want an advanced economic analysis on this?
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 max-w-md mt-1 mb-5 leading-normal">
                    Trigger an AI deep dives reviewing a 10-year historical trajectory, structured definitions, and specific macroeconomic variable graphs.
                  </p>
                  <button
                    onClick={loadInDepthAnalysis}
                    className="bg-emerald-950 text-white font-sans text-xs font-semibold tracking-wider px-5 py-3 rounded-lg border border-emerald-800 hover:bg-emerald-900 shadow transition-colors uppercase"
                  >
                    Generate Advanced In-Depth Briefing
                  </button>
                </div>
              )}

              {/* Loading Corridor Analysis */}
              {loadingAnalysis && (
                <div className="flex flex-col items-center py-10 space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-800 animate-spin" />
                  </div>
                  <p className="font-sans text-xs text-neutral-700 font-semibold uppercase animate-pulse tracking-wider">
                    ANALYZING CONCEPT VARIABLES...
                  </p>
                  <p className="font-mono text-[11px] text-neutral-500 italic">
                    {REASSURING_MESSAGES[msgIdx]}
                  </p>
                </div>
              )}

              {/* In-depth content renders */}
              {inDepth && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 pt-2 select-text"
                >
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-4">
                    <BookOpen className="w-5 h-5 text-emerald-800" />
                    <h3 className="font-serif text-xl font-bold text-neutral-900">
                      Advanced Macro Briefing
                    </h3>
                  </div>

                  {/* Historical origins */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-widest font-sans">
                      <History className="w-4 h-4 text-stone-500" />
                      10-Year Historical Origins
                    </div>
                    <p className="font-serif text-sm text-neutral-700 leading-relaxed indent-4">
                      {inDepth.historicalContext}
                    </p>
                  </div>

                  {/* Structural Winners vs Losers */}
                  <div className="space-y-4.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-widest font-sans">
                      <Users className="w-4 h-4 text-stone-500" />
                      Strategic Stakeholder Analysis
                    </div>
                    <p className="font-serif text-sm text-neutral-700 leading-relaxed">
                      {inDepth.keyStakes}
                    </p>
                  </div>

                  {/* Micro Indicators involved */}
                  {inDepth.macroeconomicVariables && (
                    <div className="space-y-2.5">
                      <span className="font-sans uppercase font-bold text-[10px] text-stone-500 tracking-wider">
                        Indicators Monitored In Model:
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {inDepth.macroeconomicVariables.map((val, idx) => (
                          <span
                            key={idx}
                            className="bg-stone-200 text-stone-800 font-mono px-2.5 py-1 rounded"
                          >
                            📈 {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Glossary Terminology Accordion */}
                  {inDepth.glossary && inDepth.glossary.length > 0 && (
                    <div className="space-y-3 bg-stone-100 p-4 border border-stone-200 rounded-lg">
                      <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                        Technical Terms Explained:
                      </h5>
                      <div className="space-y-2">
                        {inDepth.glossary.map((g, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-stone-200 rounded-md overflow-hidden"
                          >
                            <button
                              onClick={() =>
                                setExpandedTerm(expandedTerm === g.term ? null : g.term)
                              }
                              className="w-full flex items-center justify-between text-left px-3.5 py-2 text-xs font-bold text-stone-800 hover:bg-stone-50 transition"
                            >
                              <span className="font-mono text-emerald-800">{g.term}</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${
                                  expandedTerm === g.term ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            <AnimatePresence>
                              {expandedTerm === g.term && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden bg-stone-50"
                                >
                                  <div className="px-3.5 py-2.5 text-xs text-neutral-600 leading-relaxed border-t border-stone-150">
                                    {g.definition}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
