import { motion } from 'framer-motion';

const industryImages: Record<string, string> = {
  tooth: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=75&auto=format&fit=crop',
  home: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75&auto=format&fit=crop',
  store: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=75&auto=format&fit=crop',
  briefcase: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=75&auto=format&fit=crop',
};

const fallbackImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=75&auto=format&fit=crop';

interface Industry {
  icon: string;
  title: string;
  description: string;
  imageUrl?: string; // optional Sanity image URL — overrides Unsplash fallback
}

interface Props {
  industries: Industry[];
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function IndustryCards({ industries }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {industries.map((industry, i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 cursor-default"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={industry.imageUrl ?? industryImages[industry.icon] ?? fallbackImage}
              alt={industry.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 transition-all duration-300" style={{background:'linear-gradient(to top, rgba(33,33,41,0.92) 0%, rgba(33,33,41,0.45) 55%, rgba(33,33,41,0.15) 100%)'}} />
          </div>

          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:'linear-gradient(to right, #9d833e, #c4a55a)'}} />

          <div className="relative p-7 pt-32">
            <h3 className="text-lg font-bold text-white mb-2">{industry.title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{industry.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
