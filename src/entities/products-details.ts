export interface ProductDetailEntity {
  product_id: number;
  detail_name: string;
  description?: string;
  price: number;
  quantity?: number;
  color?: string;
  size?: string;
  storage?: string;
  devices?: string;
  active: boolean;
}

export interface ProductDetailEntityOptional {
  product_id?: number;
  detail_name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  color?: string;
  size?: string;
  storage?: string;
  devices?: string;
  active?: boolean;
}
