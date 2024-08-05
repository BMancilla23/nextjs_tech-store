interface Image {
  color: string;
  colorCode: string;
  image: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string;
  hashedPassword: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdDate: string;
  user: User;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  inStock: boolean;
  images: Image[];
  reviews: Review[];
}