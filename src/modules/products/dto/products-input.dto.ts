export interface CreateProductsDto {
  name: string;
  description: string;
  code?: string;
  group?: string;
  base_price: number;
  category_id?: string;
  brand_id?: string;
  available_quantity?: number;
  maximum_allowed_quantity?: number;
  tax_type?: string;
  tax_value?: number;
}
export interface FetchProductDetailsDto {
  id?: string;
  name?: string;
  code?: string;
  category_id?: string;
  brand_id?: string;
  page?: number;
  limit?: number;
}
export interface CreatePricingsDto {
  name: string;
  description?: string;
  type?: string;
  base_value?: number;
  tax_value?: number;
}
export interface FetchPricingDetailsDto {
  id?: string;
  name?: string;
  description?: string;
  code?: string;
  type?: string;
  value?: number;
  is_tax_applicable?: boolean;
}
