import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const reviews = [
  {
    id: 1,
    name: "Sparkle Light",
    role: "Business Owner",
    company: "Sparkle Light",
    rating: 5,
    content:
      "Majid and his team brought an incredible level of creativity, expertise, and genuine dedication — handling everything from content creation to our full digital strategy across Instagram, Facebook, YouTube, and TikTok. What makes CiCon truly stand out is their personalized approach. We've seen measurable improvements in brand awareness, engagement, and most importantly — sales. I truly believe Sparkle Light would not be where it is today without their continued support.",
  },
  {
    id: 2,
    name: "Ashkan Pourshaban",
    role: "Local Guide",
    company: "",
    rating: 5,
    content:
      "We've been working with CiCon for our social media marketing and advertising, and the experience has been fantastic from day one. Their team is creative, responsive, and truly understands how to position our brand online. Since partnering with them, we've seen a noticeable increase in engagement, followers, and overall brand awareness. They regularly provide insights and updates, making it easy to track progress and results. Highly recommend CiCon to any business looking to grow their digital presence with a reliable and professional marketing team!",
  },
  {
    id: 3,
    name: "NickNuts GTA",
    role: "Local Business Owner",
    company: "",
    rating: 5,
    content:
      "Creative, responsive, and results-driven. CiCon helped elevate our brand with smart strategy and great execution. From the very first meeting they understood exactly what we needed and delivered beyond expectations.",
  },
  {
    id: 4,
    name: "Alex",
    role: "Small Business Owner",
    company: "",
    rating: 5,
    content:
      "Exceeded expectations with strong support, great communication, and a real partnership approach. The team genuinely cares about your success and treats your business like their own.",
  },
  {
    id: 5,
    name: "Soroush",
    role: "Entrepreneur",
    company: "",
    rating: 5,
    content:
      "Professional, fast, and reliable. CiCon built a beautiful website and delivered strong SEO results that have made a real difference to our online visibility and lead generation.",
  },
];

export default function GoogleReviews() {
  return (
    <AnimatedTestimonials
      title="What our clients say"
      subtitle="Real results from real GTA businesses who trusted CiCon Marketing to grow their brand."
      badgeText="5-Star Google Reviews"
      testimonials={reviews}
      autoRotateInterval={7000}
    />
  );
}
