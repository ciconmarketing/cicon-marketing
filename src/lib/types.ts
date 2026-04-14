export interface HeroData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
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

export interface ContactData {
  headline: string;
  email: string;
  phone: string;
  address: string;
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
