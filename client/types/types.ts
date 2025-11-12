export interface CurrentUser {
  email: string;
  id: string;
  username: string;
  iat: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  downloads: number;
  imageUrl: string;
  fileUrl: string;
  duration: string;
  size: string;
}
