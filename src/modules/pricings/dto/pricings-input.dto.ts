export interface CreatePricingsDto {
  name: string;
  description?: string;
  productId?: string;
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
