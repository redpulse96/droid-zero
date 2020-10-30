export interface CreateCartDto {
  product_id: string;
  quantity: number;
  user_id: string;
}

export interface FetchCartDto {
  id?: string;
  product_id?: string;
  user_id?: string;
}

export interface UpdateCartDto {
  id: string;
  update_obj: {
    name?: string;
    description?: string;
    status: string;
  };
}
