export interface ProductEntity {
  category_id: number;
  product_name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string;
}

export interface ProductEntityOptional {
  category_id?: number;
  product_name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image_url?: string;
}


