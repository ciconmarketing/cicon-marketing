import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'NickNuts GTA',
    role: 'Local Business Owner',
    initial: 'N',
    quote:
      '"Creative, responsive, and results-driven. CiCon helped elevate our brand with smart strategy and great execution."',
  },
  {
    name: 'Alex',
    role: 'Small Business Owner',
    initial: 'A',
    quote:
      '"Exceeded expectations with strong support, great communication, and a real partnership approach."',
  },
  {
    name: 'Soroush',
    role: 'Entrepreneur',
    initial: 'S',
    quote:
      '"Professional, fast, and reliable. CiCon built a beautiful website and delivered strong SEO results."',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="#f59e0b">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Google logo text in brand colours
function GoogleLogo() {
  return (
    <span className="text-2xl font-bold tracking-tight select-none">
      <span style={{ color: '#4285F4' }}>G</span>
      <span style={{ color: '#EA4335' }}>o</span>
      <span style={{ color: '#FBBC05' }}>o</span>
      <span style={{ color: '#4285F4' }}>g</span>
      <span style={{ color: '#34A853' }}>l</span>
      <span style={{ color: '#EA4335' }}>e</span>
    </span>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export default function GoogleReviews() {
  return (
    <section className="py-20 lg:py-28" style={{ background: '#f9f5ee' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-14"
        >
          <div className="bg-white rounded-2xl px-10 py-6 shadow-md flex flex-col items-center gap-2 border border-gray-100">
            <span className="text-sm font-black uppercase tracking-widest text-gray-700 mb-1">Excellent</span>
            <Stars />
            <GoogleLogo />
          </div>
        </motion.div>

        {/* Review cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all duration-300 flex flex-col gap-5 cursor-default"
            >
              {/* Stars */}
              <Stars />

              {/* Quote */}
              <p className="text-gray-600 italic leading-relaxed text-sm flex-1">
                {review.quote}
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: '#212129' }}
                >
                  {review.initial}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
