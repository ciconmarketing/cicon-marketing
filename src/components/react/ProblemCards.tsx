import { motion } from 'framer-motion';
import {
  DollarSign, BarChart3, Zap, Globe, TrendingUp, Clock, HelpCircle,
  CheckCircle2, XCircle
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  money: DollarSign,
  chart: BarChart3,
  boxing: Zap,
  web: Globe,
  trend: TrendingUp,
  clock: Clock,
};

// A distinct accent colour per card (cycles through 6)
const accents = [
  { from: '#ef4444', to: '#dc2626' }, // red
  { from: '#f97316', to: '#ea580c' }, // orange
  { from: '#a855f7', to: '#9333ea' }, // purple
  { from: '#ef4444', to: '#b91c1c' }, // crimson
  { from: '#ec4899', to: '#db2777' }, // pink
  { from: '#f59e0b', to: '#d97706' }, // amber
];

interface Problem {
  icon: string;
  problem: string;
  solution: string;
}

interface Props {
  problems: Problem[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function ProblemCards({ problems }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {problems.map((item, i) => {
        const IconComponent = iconMap[item.icon] ?? HelpCircle;
        const accent = accents[i % accents.length];

        return (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 cursor-default flex flex-col"
          >
            {/* ── Problem header (dark) ─────────────────── */}
            <div
              className="relative p-6 pb-7 flex-1"
              style={{ background: 'linear-gradient(135deg, #212129 0%, #2e2e3a 100%)' }}
            >
              {/* Subtle radial glow behind icon */}
              <div
                className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full blur-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle, ${accent.from}, transparent)` }}
              />

              {/* Icon pill */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-semibold mb-5"
                style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
              >
                <XCircle className="w-3.5 h-3.5" />
                The Problem
              </div>

              {/* Big icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 opacity-90"
                style={{ background: `${accent.from}22` }}
              >
                <IconComponent className="w-5 h-5" style={{ color: accent.from }} />
              </div>

              <h3 className="text-white font-bold text-base leading-snug">
                {item.problem}
              </h3>
            </div>

            {/* ── Connector arrow ───────────────────────── */}
            <div className="flex items-center bg-white">
              <div className="flex-1 h-px bg-gray-100" />
              <div
                className="mx-auto -my-3 w-7 h-7 rounded-full flex items-center justify-center shadow-md z-10 relative"
                style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* ── Solution footer (light) ───────────────── */}
            <div className="bg-white p-6 pt-7 border-t-0 border border-gray-100">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: '#0d9488' }}
                />
                <div>
                  <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
                    Our Fix
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.solution}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
