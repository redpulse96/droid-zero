export interface CreateOrdersDto {
  name: string;
  description: string;
  code?: string;
  image_path?: string;
}

export interface FetchOrdersDto {
  name?: string;
  id?: string;
  code?: string;
}

export interface UpdateOrdersDto {
  id: string;
  update_obj: {
    name?: string;
    description?: string;
    status: string;
  };
}
