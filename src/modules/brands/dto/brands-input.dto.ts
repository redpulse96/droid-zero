export interface CreateBrandsDto {
  name: string;
  description: string;
  code?: string;
  image_path?: string;
}

export interface FetchBrandsDto {
  name?: string;
  id?: string;
  code?: string;
}

export interface UpdateBrandsDto {
  id: string;
  update_obj: {
    name?: string;
    description?: string;
    status: string;
  };
}
