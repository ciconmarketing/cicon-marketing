import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Step {
  stepNumber: string | number;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

const stepIcons = [
  // Discovery
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>,
  // Strategy
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>,
  // Implementation
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  // Optimize
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>,
];

function StepCard({ step, index, total }: { step: Step; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      {/* Connector line (except last) */}
      {index < total - 1 && (
        <div className="hidden lg:block absolute top-[52px] left-[calc(50%+52px)] right-[-calc(50%-52px)] w-[calc(100%-104px)] h-px overflow-hidden z-0"
          style={{ left: 'calc(50% + 52px)', width: 'calc(100% - 104px)' }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, delay: 0.3 + index * 0.2, ease: 'easeInOut' }}
            style={{ originX: 0 }}
            className="h-full bg-gradient-to-r from-teal-600/60 to-teal-400/30"
          />
        </div>
      )}

      {/* Step node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 + index * 0.18 }}
        className="relative z-10 mb-6"
      >
        {/* Outer pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3, delay: 1 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border-2 border-teal-500/40"
        />
        <div className="w-[104px] h-[104px] rounded-full bg-navy-800 border-2 border-teal-600/50 flex flex-col items-center justify-center gap-1 shadow-lg shadow-teal-900/30 group-hover:border-teal-400">
          <span className="text-teal-400">{stepIcons[index % stepIcons.length]}</span>
          <span className="text-xs font-black text-teal-600/80 tabular-nums">{step.stepNumber}</span>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.55, delay: 0.2 + index * 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-teal-600/50 rounded-2xl p-6 text-center transition-colors duration-300 cursor-default w-full"
      >
        <h3 className="text-base font-bold text-white mb-3 leading-snug">{step.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
      </motion.div>
    </div>
  );
}

export default function ProcessSteps({ steps }: Props) {
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInView = useInView(lineRef, { once: true, margin: '-80px' });

  return (
    <div className="relative">
      {/* Animated backbone line */}
      <div ref={lineRef} className="hidden lg:block absolute top-[52px] left-[8%] right-[8%] h-0.5 z-0 overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={lineInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ originX: 0 }}
          className="h-full bg-gradient-to-r from-transparent via-teal-700/40 to-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} total={steps.length} />
        ))}
      </div>
    </div>
  );
}
