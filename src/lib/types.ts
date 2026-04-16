export interface HeroData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  heroImageUrl?: string; // optional Sanity image override
}

export interface Stat {
  value: string;
  label: string;
}

export interface WhyCiConData {
  headline: string;
  stats: Stat[];
  description: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface ServicesData {
  headline: string;
  items: Service[];
}

export interface Industry {
  title: string;
  description: string;
  icon: string;
  imageUrl?: string; // optional Sanity image (falls back to Unsplash)
}

export interface WhoWeServeData {
  headline: string;
  subheadline: string;
  industries: Industry[];
}

export interface Step {
  stepNumber: string;
  title: string;
  description: string;
}

export interface HowItWorksData {
  headline: string;
  subheadline: string;
  steps: Step[];
}

export interface Problem {
  problem: string;
  solution: string;
  icon: string;
}

export interface ProblemsSolvedData {
  headline: string;
  subheadline: string;
  problems: Problem[];
}

export interface ReadyToGrowData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
}

export interface SocialLink {
  platform: string; // 'linkedin' | 'facebook' | 'instagram' | 'twitter'
  url: string;
}

export interface ContactData {
  headline: string;
  email: string;
  phone: string;
  address: string;
  socialLinks?: SocialLink[];
}

export interface HomepageData {
  hero: HeroData;
  whyCicon: WhyCiConData;
  services: ServicesData;
  whoWeServe: WhoWeServeData;
  howItWorks: HowItWorksData;
  problemsSolved: ProblemsSolvedData;
  readyToGrow: ReadyToGrowData;
  contact: ContactData;
}
