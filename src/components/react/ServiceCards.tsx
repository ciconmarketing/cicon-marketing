import { motion } from 'framer-motion';
import {
  Megaphone, Search, Stethoscope, MessageSquare,
  Code2, Users, MapPin, Video, Star
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  megaphone: Megaphone,
  search: Search,
  tooth: Stethoscope,
  social: MessageSquare,
  code: Code2,
  crm: Users,
  map: MapPin,
  video: Video,
};

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  items: ServiceItem[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function ServiceCards({ items }: Props) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {items.map((service, i) => {
        const IconComponent = iconMap[service.icon] ?? Star;
        return (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-shadow duration-300 flex flex-col cursor-default"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center mb-5 transition-colors duration-200 flex-shrink-0">
              <IconComponent className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2 leading-snug">
              {service.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-grow">
              {service.description}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
