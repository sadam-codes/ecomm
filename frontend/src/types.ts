// src/types.ts
export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductPayload = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductPayload = Partial<CreateProductPayload>;
