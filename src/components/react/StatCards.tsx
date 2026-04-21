import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Stat {
  value: string;
  label: string;
}

interface Props {
  stats: Stat[];
}

/** Parse "250+" → { number: 250, suffix: "+" },  "40%" → { number: 40, suffix: "%" } */
function parseValue(raw: string): { number: number; suffix: string } {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)/);
  if (match) return { number: parseFloat(match[1]), suffix: match[2] };
  return { number: 0, suffix: raw };
}

function CountStat({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { number, suffix } = parseValue(stat.value);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (inView && number > 0) {
      const controls = animate(count, number, {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [inView, number]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
      className="text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-200 cursor-default transition-shadow duration-300"
    >
      <div className="text-5xl md:text-6xl font-black text-teal-600 mb-2 tabular-nums">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </div>
      <div className="text-base font-semibold text-gray-600 uppercase tracking-wider">
        {stat.label}
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export default function StatCards({ stats }: Props) {
  const cols =
    stats.length === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : stats.length === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-2';

  return (
    <motion.div
      className={`grid ${cols} gap-6 mb-16`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {stats.map((stat, i) => (
        <motion.div key={i} variants={itemVariants}>
          <CountStat stat={stat} />
        </motion.div>
      ))}
    </motion.div>
  );
}
