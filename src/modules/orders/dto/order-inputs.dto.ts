export interface CreateOrdersDto {
  id: any;
  remarks: string;
  mobile_number: string;
  code?: string;
  image_path?: string;
  mode_of_payment: string;
  payment_id: string;
  notes: string;
  amount: number;
  quantity_details: any;
}

export interface FetchOrdersDto {
  id: any;
}

export interface UpdateOrdersDto {
  id: string;
  update_obj: {
    name?: string;
    description?: string;
    status: string;
  };
}
