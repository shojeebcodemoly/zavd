import { ProductImage } from "./product";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  image?: ProductImage;
  bio?: string;
  order: number;
}

