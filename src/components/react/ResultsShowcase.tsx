import React, { useRef, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function ResultsShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect prefers-reduced-motion — pause autoplay for sensitive users
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => {
      if (mq.matches) {
        video.pause();
      } else {
        video.play().catch(() => {/* autoplay blocked — silently ignore */});
      }
    };

    applyMotionPreference();
    mq.addEventListener("change", applyMotionPreference);
    return () => mq.removeEventListener("change", applyMotionPreference);
  }, []);

  return (
    <section className="bg-white overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="mb-4">
            {/* Eyebrow */}
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(168,132,63,0.10)", color: "#A8843F" }}
            >
              What We Capture
            </span>

            {/* Heading — split colour */}
            <h2
              className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
              style={{ color: "#212129" }}
            >
              Premium video, built for
              <br />
              <span style={{ color: "#A8843F" }}>the brands behind it.</span>
            </h2>

            {/* Subheading */}
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              From custom homes to luxury dental clinics — we produce the cinematic content that makes premium businesses look the part.
            </p>
          </div>
        }
      >
        {/* ── Showreel video (replaces static image) ── */}
        <video
          ref={videoRef}
          src="/real-client-results.mp4"
          poster="/real-client-results-poster.jpg"
          aria-label="Showreel of CiCon Marketing client video production"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="mx-auto rounded-2xl object-cover h-full w-full"
          style={{ aspectRatio: "16/9" }}
        />
      </ContainerScroll>
    </section>
  );
}
