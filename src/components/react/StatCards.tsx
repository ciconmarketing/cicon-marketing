import { motion } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
}

interface Props {
  stats: Stat[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function StatCards({ stats }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={statVariants}
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          className="text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-200 cursor-default transition-shadow duration-300"
        >
          <div className="text-5xl md:text-6xl font-black text-teal-600 mb-2 tabular-nums">
            {stat.value}
          </div>
          <div className="text-base font-semibold text-gray-600 uppercase tracking-wider">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
