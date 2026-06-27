/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Landmark,
  Globe2,
  Zap,
  Lightbulb,
  Map,
  CloudLightning,
  Play,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

import { NewsArticle, CategorySummary, NewsCategory } from './types';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import ArticleModal from './components/ArticleModal';

const CATEGORIES_LIST: { id: NewsCategory; label: string; icon: any; colorText: string; colorBg: string }[] = [
  {
    id: 'breaking',
    label: 'Breaking News',
    icon: Zap,
    colorText: 'text-amber-800',
    colorBg: 'bg-amber-100/60 border-amber-200',
  },
  {
    id: 'economy',
    label: 'Economy',
    icon: TrendingUp,
    colorText: 'text-emerald-800',
    colorBg: 'bg-emerald-100/60 border-emerald-200',
  },
  {
    id: 'us_politics',
    label: 'US Politics',
    icon: Landmark,
    colorText: 'text-blue-800',
    colorBg: 'bg-blue-100/60 border-blue-200',
  },
  {
    id: 'foreign_politics',
    label: 'Foreign Politics',
    icon: Globe2,
    colorText: 'text-purple-800',
    colorBg: 'bg-purple-100/60 border-purple-200',
  },
  {
    id: 'innovations',
    label: 'Innovations',
    icon: Lightbulb,
    colorText: 'text-orange-850',
    colorBg: 'bg-orange-100/60 border-orange-200',
  },
  {
    id: 'local',
    label: 'Local News',
    icon: Map,
    colorText: 'text-indigo-800',
    colorBg: 'bg-indigo-100/60 border-indigo-200',
  },
  {
    id: 'weather',
    label: 'Weather Events',
    icon: CloudLightning,
    colorText: 'text-cyan-800',
    colorBg: 'bg-cyan-100/60 border-cyan-200',
  },
];

export default function App() {
  const [category, setCategory] = useState<NewsCategory>('economy');
  const [location, setLocation] = useState<string>('New York, NY');
  const [summary, setSummary] = useState<CategorySummary | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Attempt to geolocate user's general location via IP on initial load
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.city) {
          const regionString = data.region ? `${data.city}, ${data.region}` : data.city;
          setLocation(regionString);
        }
      })
      .catch((err) => {
        console.warn("IP geolocation bypassed or rate-limited. Defaulting to New York, NY:", err);
      });
  }, []);

  // Fetch Category function memoized to avoid re-trigger cycles on dependency arrays as outlined in React guidelines
  const fetchCategoryNews = useCallback(async (cat: NewsCategory, loc: string) => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const url = `/api/news?category=${cat}&location=${encodeURIComponent(loc)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("HTTP Network Error");
      }
      const data = await response.json();
      setSummary(data.summary || null);
      setArticles(data.articles || []);
    } catch (err) {
      console.error("News load error:", err);
      setErrorStatus("Unable to synchronize with high-affinity news servers. Review connections.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync category contents on category or location updates
  useEffect(() => {
    fetchCategoryNews(category, location);
  }, [category, location, fetchCategoryNews]);

  const handleRefresh = () => {
    fetchCategoryNews(category, location);
  };

  const handleLocationChange = (newLoc: string) => {
    setLocation(newLoc);
  };

  const getActiveTabColor = (catId: NewsCategory) => {
    switch (catId) {
      case 'economy':
        return 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
      case 'us_politics':
        return 'border-blue-600 bg-blue-50 text-blue-950 font-bold';
      case 'foreign_politics':
        return 'border-purple-600 bg-purple-50 text-purple-950 font-bold';
      case 'breaking':
        return 'border-amber-600 bg-amber-50 text-amber-950 font-bold';
      case 'innovations':
        return 'border-orange-600 bg-orange-50 text-orange-950 font-bold';
      case 'local':
        return 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold';
      case 'weather':
        return 'border-cyan-600 bg-cyan-50 text-cyan-950 font-bold';
      default:
        return 'border-stone-800 bg-stone-100 text-stone-950';
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/40 text-neutral-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans flex flex-col pb-16">
      
      {/* Top Header */}
      <Header
        currentLocation={location}
        onLocationChange={handleLocationChange}
        isLoading={loading}
        onRefresh={handleRefresh}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 mt-8 flex flex-col lg:grid lg:grid-cols-12 gap-8 flex-1">
        
        {/* Navigation Sidebar Drawer - Editorial Style - Col-Span-3 */}
        <aside className="lg:col-span-3 space-y-5">
          
          {/* Main sections block */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <h3 className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mb-3">
              Editorial Desks
            </h3>
            
            <nav className="flex flex-row overflow-x-auto lg:flex-col lg:overflow-x-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES_LIST.map((item) => {
                const IconComponent = item.icon;
                const isActive = category === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setCategory(item.id)}
                    className={`flex items-center gap-3 w-max lg:w-full text-left px-3.5 py-2.5 rounded-lg border text-xs tracking-tight transition whitespace-nowrap lg:whitespace-normal ${
                      isActive
                        ? getActiveTabColor(item.id)
                        : 'border-transparent text-neutral-600 hover:bg-stone-50 hover:text-neutral-900 font-medium'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 `} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Educational Sidebar Box */}
          <div className="bg-white border border-stone-200 rounded-xl p-4.5 shadow-sm space-y-3 hidden lg:block">
            <div className="flex items-center gap-1 text-[10.5px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              EconWorld Policy
            </div>
            <p className="font-serif text-[11.5px] text-neutral-600 leading-normal">
              Unlike traditional news hubs, <strong>EconWorld Pulse</strong> utilizes zero incentivized keywords, eliminates advertisement modules, and serves real macroeconomic grounded research specifically. Use the local desks to map home actions directly to world currency, tariff, and resource cycles.
            </p>
          </div>
        </aside>

        {/* Primary Screen Feed - Col-Span-9 */}
        <div className="lg:col-span-9 flex flex-col">
          
          {/* Feed Network Error Notice */}
          {errorStatus && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4.5 mb-6 text-xs text-amber-900 flex items-center justify-between">
              <span>{errorStatus}</span>
              <button
                onClick={handleRefresh}
                className="bg-amber-900 text-white font-semibold font-mono tracking-wider px-3 py-1 rounded"
              >
                Retry Link
              </button>
            </div>
          )}

          {/* AI Executive briefing cards */}
          {summary && !loading && (
            <SummaryCard summary={summary} category={category} location={location} />
          )}

          {/* News Loading Frame */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-800 animate-spin" />
              </div>
              <p className="font-sans text-xs font-semibold text-neutral-600 tracking-wider uppercase animate-pulse">
                Synchronizing Global Economic Indices...
              </p>
              <p className="font-mono text-[10.5px] text-neutral-400 mt-1">
                Searching verified digital trade journals (2026)...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Main Headline Label */}
              <div className="border-b border-stone-200 pb-2 mb-4 flex items-center justify-between">
                <span className="font-serif text-sm font-black text-neutral-800 italic">
                  Grounded Journal Entries
                </span>
                <span className="font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">
                  {articles.length} Articles Available
                </span>
              </div>

              {/* Articles Bento Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {articles.map((article, idx) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex flex-col justify-between bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md transition duration-200 group hover:border-neutral-350"
                  >
                    {/* Top Row: publisher & date */}
                    <div>
                      <div className="flex items-center justify-between gap-2.5 mb-3 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                        {article.isBroken ? (
                          <span className="bg-stone-100 text-neutral-500 font-semibold px-2 py-0.5 rounded">
                            {article.source}
                          </span>
                        ) : (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            referrerPolicy="no-referrer"
                            className="bg-stone-100 hover:bg-emerald-50 hover:text-emerald-950 text-neutral-700 font-semibold px-2 py-0.5 rounded transition"
                          >
                            {article.source}
                          </a>
                        )}
                        <span>{article.date}</span>
                      </div>

                      {/* Main Title */}
                      <h4 className="font-serif text-[17px] font-bold text-neutral-900 group-hover:text-emerald-950 leading-snug tracking-tight mb-2">
                        {article.isBroken ? (
                          <span className="text-neutral-900">{article.title}</span>
                        ) : (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            referrerPolicy="no-referrer"
                            className="hover:underline hover:text-emerald-800 transition-colors inline-flex items-start gap-1"
                          >
                            <span>{article.title}</span>
                            <ArrowUpRight className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}
                      </h4>

                      {/* Subtitle */}
                      <p className="font-sans text-xs text-neutral-500 leading-normal mb-4.5">
                        {article.subtitle}
                      </p>
                    </div>

                    {/* Meta Section: macro connection & read triggers */}
                    <div className="border-t border-neutral-100/80 pt-3.5 space-y-3.5 w-full">
                      {/* Macro connection excerpt */}
                      <div className="text-[11px] font-serif italic text-neutral-600 bg-stone-50 p-2.5 border-l-2 border-emerald-500 rounded-r">
                        💡 {article.globalConnection.slice(0, 105)}...
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between text-xs font-semibold font-sans">
                        <div className="flex items-center gap-2">
                          {/* Direct External Link */}
                          {article.isBroken ? (
                            <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-500 text-[11px] font-medium px-3 py-1.5 rounded select-none border border-stone-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                              <span>Article unavailable or moved</span>
                            </span>
                          ) : (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              referrerPolicy="no-referrer"
                              className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-750 px-2.5 py-1.5 rounded transition"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>Read Article</span>
                            </a>
                          )}

                          {/* Immersive AI Analysis Room */}
                          <button
                            onClick={() => setSelectedArticle(article)}
                            className="inline-flex items-center gap-1 bg-emerald-950 hover:bg-emerald-900 text-white px-2.5 py-1.5 rounded transition cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 text-white fill-white" />
                            <span>AI Room</span>
                          </button>
                        </div>
                        
                        <span className="text-[10px] bg-stone-100 text-neutral-500 px-2 py-0.5 rounded font-mono">
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* No articles fallbacks */}
              {articles.length === 0 && (
                <div className="flex flex-col items-center justify-center border border-dashed border-stone-300 rounded-xl py-16 text-center bg-white">
                  <Globe2 className="w-8 h-8 text-neutral-400 animate-spin mb-3" />
                  <h4 className="font-serif text-base font-bold text-neutral-700">
                    No matching economic briefs registered
                  </h4>
                  <p className="font-sans text-xs text-neutral-400 mt-1 max-w-sm">
                    EconWorld is presently establishing digital search corridors for {location}. Check back shortly.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Full Sheet Article Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        location={location}
      />
    </div>
  );
}
