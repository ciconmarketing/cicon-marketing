import { motion } from 'framer-motion';
import {
  Megaphone, Search, Stethoscope, MessageSquare,
  Code2, Users, MapPin, Video, Star,
  PenTool, TrendingUp, Compass, Settings
} from 'lucide-react';
import { GlowingEffect } from './GlowingEffect';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  megaphone:  Megaphone,
  search:     Search,
  tooth:      Stethoscope,
  social:     MessageSquare,
  code:       Code2,
  crm:        Users,
  map:        MapPin,
  video:      Video,
  content:    PenTool,
  cro:        TrendingUp,
  consultant: Compass,
  martech:    Settings,
};

const slugMap: Record<string, string> = {
  megaphone:  '/marketing-services/paid-advertising-services/',
  search:     '/marketing-services/ai-seo/',
  tooth:      '/marketing-services/dental-marketing-services/',
  social:     '/marketing-services/social-media-marketing-services/',
  code:       '/marketing-services/website-development/',
  crm:        '/marketing-services/crm-integration/',
  map:        '/marketing-services/local-seo-optimization/',
  video:      '/marketing-services/media-content-production/',
  content:    '/marketing-services/content-marketing/',
  cro:        '/marketing-services/conversion-rate-optimization/',
  consultant: '/marketing-services/marketing-consultant/',
  martech:    '/marketing-services/marketing-technology-setup/',
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
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
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
        const href = slugMap[service.icon] ?? '/marketing-services/';
        return (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="relative rounded-2xl"
          >
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <a
              href={href}
              className="group relative rounded-2xl p-6 flex flex-col cursor-pointer h-full no-underline transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(157,131,62,0.45)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
              aria-label={`Learn more about ${service.title}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 flex-shrink-0 transition-colors duration-200 group-hover:[background:rgba(157,131,62,0.25)]"
                style={{ background: 'rgba(157,131,62,0.12)' }}
              >
                <IconComponent className="w-6 h-6 transition-colors duration-200" style={{ color: '#FFCF00' } as React.CSSProperties} />
              </div>
              <h3 className="text-base font-bold mb-2 leading-snug" style={{ color: '#ffffff' }}>
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed flex-grow" style={{ color: '#a0a0b0' }}>
                {service.description}
              </p>
              <span className="mt-4 text-xs font-semibold flex items-center gap-1 transition-colors duration-200" style={{ color: '#9D833E' }}>
                Learn more
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
