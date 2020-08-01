export interface CreateProductsDto {
  name: string;
  description: string;
  code?: string;
  category_id?: string;
  subcategory_id?: string;
}
export interface FetchProductDetailsDto {
  id?: string;
  name?: string;
  code?: string;
  category_id?: string;
  subcategory_id?: string;
}
