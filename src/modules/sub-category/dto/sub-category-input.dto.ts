export interface CreateSubCategoryDto {
  name: string;
  description: string;
  code?: string;
  image_path?: string;
}
export interface FetchSubCategoryDto {
  name?: string;
  id?: string;
  category_id?: string;
  code?: string;
}
