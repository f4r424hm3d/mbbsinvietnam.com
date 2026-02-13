
export interface University {
  id: number;
  name: string;
  slug: string;
  city_id: string;
  province_id: string;
  is_featured: number;
  thumbnail_path: string;
  rating: string;
  established_year: string;
  scholarship_name: string | null;
  scholarship_amount: string | null;
  seats_available: number | null;
  institute_type_id: number;
  students: number | null;
  tuition_fee: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  institute_type: InstituteType;
  get_province: Province;
  get_city: City;
}

export interface InstituteType {
  id: number;
  institute_type: string;
  institute_type_slug: string;
  created_at: string;
  updated_at: string;
}

export interface Province {
  id: number;
  province_name: string;
  province_slug: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface City {
  id: number;
  city_name: string;
  city_slug: string;
  province_id: number;
  created_at: string;
  updated_at: string;
}

export interface Filters {
  institute_types: InstituteType[];
  cities: City[];
}

export interface AppliedFilters {
  current_institute_type: string | null;
  current_state: string | null;
}

export interface SEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  page_content: string;
  og_image_path: string | null;
}

export interface UniversitiesResponse {
  status: boolean;
  message: string;
  data: {
    universities: {
      current_page: number;
      data: University[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: {
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
      }[];
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
    filters: Filters;
    applied_filters: AppliedFilters;
    seo: SEO;
  };
}
