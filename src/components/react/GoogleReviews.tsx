import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

// Pulled verbatim from the connected Google Business Profile (via Localo) on
// 2026-08-12 — kept in sync with RReviews.astro (the homepage's version of
// this same section). Must stay a 1:1 match with the live GBP review set,
// since the AggregateRating schema (RATING_VALUE/REVIEW_COUNT) claims exactly
// these reviews exist. Two placeholder entries that didn't correspond to any
// real Google review ("Alex" / "Soroush") were removed for that reason.
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
    name: "Adnan Larijani",
    role: "Business Owner",
    company: "",
    rating: 5,
    content:
      "We used CiCon's digital marketing services for our business and had a great experience. Their team is professional, knowledgeable, and delivered excellent results. If you're looking for Local SEO and digital marketing services, CiCon Marketing is one of the best options in the Richmond Hill area. Highly recommended for all business owners looking to grow their online presence.",
  },
  {
    id: 3,
    name: "Ashkan Pourshaban",
    role: "Local Guide",
    company: "",
    rating: 5,
    content:
      "We've been working with CiCon for our social media marketing and advertising, and the experience has been fantastic from day one. Their team is creative, responsive, and truly understands how to position our brand online. Since partnering with them, we've seen a noticeable increase in engagement, followers, and overall brand awareness. They regularly provide insights and updates, making it easy to track progress and results. Highly recommend CiCon to any business looking to grow their digital presence with a reliable and professional marketing team!",
  },
  {
    id: 4,
    name: "Afsoun Beauty Club",
    role: "Business Owner",
    company: "",
    rating: 5,
    content:
      "I had a great experience working with CiCon Marketing. Their team is professional, responsive, and genuinely cares about helping businesses grow. They take the time to understand your goals and provide clear strategies that deliver results. Communication was excellent throughout the process, and I appreciated their attention to detail and transparency. I highly recommend CiCon Marketing to anyone looking for reliable and effective digital marketing services.",
  },
  {
    id: 5,
    name: "Arash Engheta",
    role: "Business Owner",
    company: "",
    rating: 5,
    content:
      "I cannot say enough good things about CICON Marketing Agency. From the moment they took over managing my Google presence, they have gone far above and beyond my expectations. Their professionalism, responsiveness, expertise, and attention to detail have been outstanding. They genuinely care about the success of my business and consistently provide valuable insights, recommendations, and support. Every interaction has been positive, and it's clear that they take pride in delivering exceptional results for their clients. Finding a marketing company that is both knowledgeable and trustworthy is not easy, but CICON has proven to be exactly that. I highly recommend them to any business looking to improve their online presence and work with a team that truly cares about achieving results.",
  },
  {
    id: 6,
    name: "Alex Shaban",
    role: "Business Owner",
    company: "",
    rating: 5,
    content:
      "We have had the pleasure of working with CiCon for our social media marketing and advertising needs, and the results have exceeded our expectations. Their team brings a high level of expertise, professionalism, and strategic insight to every campaign. From content creation to targeted ad strategies, they have consistently delivered measurable outcomes and enhanced our online presence. Communication is seamless, and their proactive approach ensures we stay ahead in a competitive market. I highly recommend CiCon to any organization seeking a dedicated and results-driven marketing partner.",
  },
  {
    id: 7,
    name: "Joseph Hajarian",
    role: "Business Owner",
    company: "",
    rating: 5,
    content:
      "We were looking to have a marketing agency to help us with our business profile to be more effective with people looking for our products and we finally found CiCon Marketing Agency and very happy to find them. Amazing work! Every step of the way explained in detail and done as promised and amazingly great value for what they offer! Thank you team CiCon!!",
  },
  {
    id: 8,
    name: "NickNuts GTA",
    role: "Local Business Owner",
    company: "",
    rating: 5,
    content:
      "Creative, responsive, and results-driven. CiCon helped elevate our brand with smart strategy and great execution. From the very first meeting they understood exactly what we needed and delivered beyond expectations.",
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
