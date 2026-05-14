import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Quote, Star } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface AnimatedTestimonialsProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  testimonials?: Testimonial[];
  autoRotateInterval?: number;
  className?: string;
}

export function AnimatedTestimonials({
  title = "What our clients say",
  subtitle = "Real results from real GTA businesses who trusted CiCon Marketing to grow their brand.",
  badgeText = "5-Star Google Reviews",
  testimonials = [],
  autoRotateInterval = 7000,
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, autoRotateInterval);
    return () => clearInterval(interval);
  }, [autoRotateInterval, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`py-24 overflow-hidden bg-[#f9f5ee] ${className ?? ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-16 w-full md:grid-cols-2 lg:gap-24 items-center"
        >
          {/* ── Left: heading + nav dots ── */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <div className="space-y-6">

              {/* Badge */}
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                  <Star className="h-3.5 w-3.5 fill-teal-600 text-teal-600" />
                  {badgeText}
                </div>
              )}

              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-[#212129]">
                {title}
              </h2>

              <p className="max-w-[520px] text-gray-500 md:text-xl leading-relaxed">
                {subtitle}
              </p>

              {/* Dot nav */}
              <div className="flex items-center gap-3 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-10 bg-teal-600"
                        : "w-2.5 bg-gray-300"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Reviewer counter */}
              <p className="text-sm text-gray-400 pt-2">
                {activeIndex + 1} of {testimonials.length} reviews
              </p>
            </div>
          </motion.div>

          {/* ── Right: testimonial cards ── */}
          <motion.div variants={itemVariants} className="relative min-h-[360px] md:min-h-[420px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 80 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 80,
                  scale: activeIndex === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
              >
                <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-8 h-full flex flex-col">

                  {/* Stars */}
                  <div className="mb-5 flex gap-1">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-6 flex-1">
                    <Quote className="absolute -top-1 -left-1 h-7 w-7 text-teal-100 rotate-180" />
                    <p className="relative z-10 text-base md:text-lg text-gray-700 leading-relaxed font-medium pl-4">
                      "{testimonial.content}"
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* Reviewer */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-gray-100">
                      {testimonial.avatar && (
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      )}
                      <AvatarFallback
                        className="text-white font-bold text-sm"
                        style={{ background: "#212129" }}
                      >
                        {testimonial.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-[#212129]">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ""}
                      </p>
                    </div>

                    {/* Google G mark */}
                    <div className="ml-auto opacity-60">
                      <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorative blobs */}
            <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-xl bg-teal-50 -z-10" />
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-xl bg-amber-50 -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
