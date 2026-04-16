import { motion } from 'framer-motion';

interface Step {
  stepNumber: string | number;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function ProcessSteps({ steps }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* Connector line – desktop only */}
      <div className="hidden lg:block absolute top-[56px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-teal-700 to-transparent z-0" />

      {steps.map((step, i) => (
        <motion.div
          key={i}
          variants={stepVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-600/50 rounded-2xl p-7 transition-colors duration-300 z-10 cursor-default"
        >
          <div className="w-14 h-14 rounded-2xl bg-navy-800 border-2 border-teal-600/40 group-hover:border-teal-500 group-hover:bg-teal-600 flex items-center justify-center mb-6 transition-all duration-300">
            <span className="text-xl font-black text-teal-400 group-hover:text-white transition-colors duration-300 tabular-nums">
              {step.stepNumber}
            </span>
          </div>

          {i < steps.length - 1 && (
            <div className="hidden lg:flex absolute -right-3 top-[56px] -translate-y-1/2 z-20">
              <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}

          <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
