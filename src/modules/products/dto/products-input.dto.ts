export interface CreateProductsDto {
  name: string;
  description: string;
  code?: string;
  group?: string;
  category_id?: string;
  subcategory_id?: string;
  prices?: any[];
}
export interface FetchProductDetailsDto {
  id?: string;
  name?: string;
  code?: string;
  category_id?: string;
  subcategory_id?: string;
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
