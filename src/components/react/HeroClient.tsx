"use client";
import { motion } from "framer-motion";
import type { HeroData } from "../../lib/types";

// ── Floating decorative pill shapes (adapted to CiCon palette) ──
function ElegantShape({
  className = "",
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-teal-500/[0.18]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={[
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.12]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.06)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]",
          ].join(" ")}
        />
      </motion.div>
    </motion.div>
  );
}

interface Props {
  data: HeroData;
}

export default function HeroClient({ data }: Props) {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.4 + i * 0.18, ease: [0.25, 0.4, 0.25, 1] },
    }),
  };

  const parts = data.headline.split("Richmond Hill");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{ background: "linear-gradient(135deg, #212129 0%, #1a1a22 50%, #0e1a1a 100%)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/25 via-transparent to-amber-900/15 pointer-events-none" />

      {/* Floating shapes — CiCon palette */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3} width={620} height={145} rotate={12}
          gradient="from-teal-500/[0.18]"
          className="left-[-8%] top-[18%]"
        />
        <ElegantShape
          delay={0.5} width={490} height={115} rotate={-16}
          gradient="from-amber-400/[0.12]"
          className="right-[-4%] top-[62%]"
        />
        <ElegantShape
          delay={0.4} width={290} height={72} rotate={-8}
          gradient="from-teal-400/[0.14]"
          className="left-[6%] bottom-[14%]"
        />
        <ElegantShape
          delay={0.6} width={210} height={58} rotate={22}
          gradient="from-yellow-500/[0.10]"
          className="right-[16%] top-[10%]"
        />
        <ElegantShape
          delay={0.7} width={145} height={40} rotate={-26}
          gradient="from-cyan-500/[0.09]"
          className="left-[24%] top-[7%]"
        />
        <ElegantShape
          delay={0.8} width={170} height={48} rotate={18}
          gradient="from-teal-600/[0.11]"
          className="right-[36%] bottom-[18%]"
        />
      </div>

      {/* ── Main content ── */}
      <div className="container-xl relative z-10 py-24 lg:py-32">
        <div className="max-w-3xl">

          {/* Dental lead badge */}
          <motion.div
            custom={-1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-semibold"
            style={{ background: "rgba(157,131,62,0.18)", border: "1px solid rgba(157,131,62,0.35)", color: "#f0c84a" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Dental clients see 40%+ more leads
          </motion.div>

          {/* Location badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-teal-300 font-medium mb-8 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Richmond Hill &amp; GTA, Ontario
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight"
          >
            {parts.map((part, i) =>
              i < parts.length - 1 ? (
                <span key={i}>
                  {part}
                  <span style={{ color: "#ffcf00" }}>Richmond Hill</span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-10 max-w-2xl"
          >
            {data.subheadline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row flex-wrap gap-4"
          >
            {/* Primary CTA */}
            <a
              href={data.ctaLink}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-2xl shadow-teal-900/60 hover:shadow-teal-600/40 hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {data.ctaText}
            </a>

            {/* Explore Services */}
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:border-white/60 hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore Services
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/19058845060"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 font-semibold text-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-white"
              style={{ background: "rgba(37,211,102,0.18)", border: "1.5px solid rgba(37,211,102,0.35)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Trust micro-copy */}
          <motion.p
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 text-sm text-gray-400 flex flex-wrap items-center gap-4"
          >
            {["Free consultation", "No long-term contracts", "Measurable results"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 text-xs animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
    </section>
  );
}
