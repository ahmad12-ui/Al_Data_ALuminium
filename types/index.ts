export interface ImageAsset {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export interface VideoAsset {
  public_id: string;
  secure_url: string;
  resource_type: string;
  duration?: number;
}

export interface ProjectDTO {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price?: string;
  location: string;
  date: string;
  category: string;
  images: ImageAsset[];
  featuredImage?: ImageAsset;
  featured: boolean;
  order: number;
  beforeImages: ImageAsset[];
  afterImages: ImageAsset[];
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDTO {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: ImageAsset;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoDTO {
  _id: string;
  name: string;
  slug: string;
  description: string;
  video?: VideoAsset;
  thumbnail?: ImageAsset;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FaqDTO {
  _id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlideDTO {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: ImageAsset;
  buttonText: string;
  buttonLink: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettingsDTO {
  businessName: string;
  tagline: string;
  secondaryTagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  locations: { label: string; address: string }[];
  socialLinks: { instagram?: string; facebook?: string; youtube?: string };
  googleMaps: { dahrki?: string; sadiqabad?: string };
  footerText: string;
}
