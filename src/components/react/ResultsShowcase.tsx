import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function ResultsShowcase() {
  return (
    <section className="bg-white overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="mb-4">
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(20,184,166,0.10)", color: "#0d9488" }}
            >
              Real Client Results
            </span>
            <h2
              className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
              style={{ color: "#212129" }}
            >
              Marketing that shows up
              <br />
              <span style={{ color: "#A8843F" }}>in your numbers.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              From ad spend to booked calls — we close every gap in your lead system so more traffic turns into real revenue.
            </p>
          </div>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80&auto=format&fit=crop"
          alt="Marketing analytics dashboard showing lead growth and campaign performance"
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}
