import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  UploadCloud,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  GitCompare,
  Lightbulb,
  Network,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/15 via-purple-600/15 to-cyan-500/15 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon Edition: AI for Research & Knowledge Discovery</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          From Scattered Information to{' '}
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-cyan bg-clip-text text-transparent">
            Actionable Intelligence.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Stop losing hours in disjointed PDFs, paywalled papers, and fragmented notes. ResearchForge AI unifies real academic literature and your private documents into evidence-grounded, verifiable knowledge.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Start Researching Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
          >
            Sign In to Workspace
          </Link>
        </div>

        {/* Privacy Assurance Pill */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Strict Zero AI-Model-Training Guarantee • Full Source Grounding • SSRF-Safe</span>
        </div>
      </section>

      {/* The 3 Entry Modes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/60">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400 mb-2">
            Three Entry Modes • One Unified Workspace
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">
            How Do You Want to Start Your Research?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mode 1: Discover */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/40 relative group hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-brand-500 mb-1">Mode 1</div>
            <h3 className="text-lg font-bold mb-2">Discover Mode</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Have a topic but no documents? AI generates structured queries and queries OpenAlex, Crossref, and Semantic Scholar for real, peer-reviewed sources.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Multi-provider parallel retrieval</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Zero fabricated papers or DOIs</span>
              </li>
            </ul>
          </div>

          {/* Mode 2: Upload */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/40 relative group hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-indigo-500 mb-1">Mode 2</div>
            <h3 className="text-lg font-bold mb-2">Upload Mode</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Drop your own PDF, DOCX, TXT, or MD files. Ingested with page-awareness, chunked, and embedded into pgvector with 768 dimensions.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Exact page number preservation</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Ephemeral in-memory stream processing</span>
              </li>
            </ul>
          </div>

          {/* Mode 3: Explore */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/40 relative group hover:border-brand-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-accent-purple mb-1">Mode 3</div>
            <h3 className="text-lg font-bold mb-2">Explore Mode</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Only have a vague interest? Gemini maps subfields, core research questions, and seed papers, converting any idea into a full project in 1-click.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Topic clustering & subdiscipline mapping</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Direct conversion to Discover projects</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Flagship Intelligence Capabilities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/60">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold text-accent-cyan mb-2">
            Beyond Chatbot Wrappers
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">
            Comprehensive Research Synthesis & Gap Discovery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/30">
            <Lightbulb className="w-6 h-6 text-purple-400 mb-3" />
            <h4 className="text-sm font-bold mb-1">Research Gap Finder (Flagship)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Detects methodological limitations, contradictory claims, and unaddressed questions across sources to pinpoint open research opportunities.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/30">
            <GitCompare className="w-6 h-6 text-brand-400 mb-3" />
            <h4 className="text-sm font-bold mb-1">Structured Comparison Matrix</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compares objectives, datasets, methods, and limitations in a side-by-side matrix with exact supporting citations in every cell.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/30">
            <Network className="w-6 h-6 text-accent-cyan mb-3" />
            <h4 className="text-sm font-bold mb-1">Grounded Knowledge Map</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Interactive node graph extracting real concepts, authors, and technologies with strict evidence references and query jumps.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/30">
            <FileCheck2 className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="text-sm font-bold mb-1">Multi-Format Report Generator</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Synthesizes academic papers, literature reviews, and technical briefs with version history and PDF, DOCX, Markdown, and LaTeX export.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/30">
            <ShieldCheck className="w-6 h-6 text-indigo-400 mb-3" />
            <h4 className="text-sm font-bold mb-1">Verified Citations & RAG</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every inline claim links directly to verbatim passage text and document page numbers. Hallucinations are actively dropped.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/30">
            <Layers className="w-6 h-6 text-amber-400 mb-3" />
            <h4 className="text-sm font-bold mb-1">Privacy & Hard Data Purge</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Default AI training opt-out, ephemeral session mode, and a complete one-click hard purge of all database vectors and storage files.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

