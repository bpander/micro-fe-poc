export interface ProductVariant {
  sku: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  price: number;
}

export interface Product {
  name: string;
  sku: string;
  variants: ProductVariant[];
}
