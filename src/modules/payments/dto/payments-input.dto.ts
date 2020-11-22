export interface CreatePaymentDto {
  amount: number;
  notes?: string;
  payment_id?: string;
}

export interface FetchPaymentDto {
  name?: string;
  id?: string;
  code?: string;
}

export interface UpdatePaymentDto {
  id: string;
  update_obj: {
    name?: string;
    description?: string;
    status: string;
  };
}
