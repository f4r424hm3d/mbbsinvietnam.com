// src/api.ts
import axios from "axios";

const API_BASE_URL = "https://admin.mymbbsinvietnam.com/api";
const API_KEY = "4hm3df4r42";

export const IMAGE_BASE_URL = "https://kgadminpanel.tutelagestudy.com/storage";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": API_KEY,
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  },
});


// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (check both possible keys)
    const token = localStorage.getItem('authToken') || localStorage.getItem('studentToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    
    // Handle unauthorized/forbidden responses (401, 403)
    // This happens when token is expired or invalid
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth data
      localStorage.removeItem('studentToken');
      localStorage.removeItem('authToken');
      localStorage.removeItem('studentId');
      localStorage.removeItem('studentEmail');
      localStorage.removeItem('studentName');
      localStorage.removeItem('isVerified');
      sessionStorage.clear();
      
      // Only redirect if we're on a student dashboard route
      if (window.location.pathname.startsWith('/student-dashboard')) {
        window.location.replace('/auth');
      }
    }
    
    return Promise.reject(error);
  }
);

import { UniversitiesResponse } from "./components/Homepage/types/university";

// University Facilities Interface
export interface UniversityFacility {
  id: number;
  description: string;
  thumbnail_name: string;
  thumbnail_path: string;
  icon_class: string | null;
  university_id: number;
  facility_id: number;
  created_at: string;
  updated_at: string;
  facility: {
    id: number;
    name: string;
  };
}

export interface UniversityFacilitiesResponse {
  message: string;
  data: {
    facilities: UniversityFacility[];
  };
}

// University Photos Interface
export interface UniversityPhoto {
  id: number;
  alt_text: string;
  photo_name: string;
  photo_path: string;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniversityPhotosResponse {
  message: string;
  data: {
    photos: UniversityPhoto[];
  };
}

// University Hospitals Interface
export interface UniversityHospital {
  id: number;
  name: string;
  type: string;
  location: string;
  beds: number | null;
  specialities: string | null;
  created_at: string;
  updated_at: string;
}

export interface UniversityHospitalsResponse {
  data: UniversityHospital[];
}

export interface GetUniversityHospitalsParams {
  limit?: number;
}

export const getUniversityHospitals = async (
  universityId: number,
  params: GetUniversityHospitalsParams = {}
): Promise<UniversityHospitalsResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/university-hospitals/${universityId}?${queryString}`
      : `/university-hospitals/${universityId}`;

    const response = await api.get(url);

    type UniversityHospitalsDataWrapper = {
      hospitals?: UniversityHospital[];
    };

    const payload = response.data as
      | { data?: UniversityHospital[] }
      | { data?: UniversityHospitalsDataWrapper };

    let hospitalsData: UniversityHospital[] = [];

    if (payload && Array.isArray(payload.data)) {
      hospitalsData = payload.data;
    } else if (
      payload &&
      payload.data &&
      Array.isArray(
        (payload.data as UniversityHospitalsDataWrapper).hospitals
      )
    ) {
      hospitalsData =
        (payload.data as UniversityHospitalsDataWrapper).hospitals ?? [];
    }

    return { data: hospitalsData };
  } catch (error) {
    console.error("Error fetching university hospitals:", error);
    throw error;
  }
};

// University Rankings Interface
export interface UniversityRanking {
  id: number;
  ranking_title: string;
  ranking_scope: string;
  rank_position: number;
  rank_change: number;
  rank_year: string;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniversityRankingsResponse {
  message: string;
  data: {
    ranking: UniversityRanking[];
  };
}

export const getUniversities = async (): Promise<UniversitiesResponse> => {
  try {
    const response = await api.get<UniversitiesResponse>("/universities");
    return response.data;
  } catch (error) {
    console.error("Error fetching universities:", error);
    throw error;
  }
};

export const getUniversityFacilities = async (universityId: number): Promise<UniversityFacilitiesResponse> => {
  try {
    const response = await api.get<UniversityFacilitiesResponse>(`/university-facilities/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university facilities:", error);
    throw error;
  }
};

export const getUniversityPhotos = async (universityId: number): Promise<UniversityPhotosResponse> => {
  try {
    const response = await api.get<UniversityPhotosResponse>(`/university-photos/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university photos:", error);
    throw error;
  }
};

// Get university by slug to get the university ID
export const getUniversityBySlug = async (slug: string): Promise<{ id: number; name: string; slug: string }> => {
  try {
    const response = await api.get(`/universities?slug=${slug}`);
    // Assuming the API returns university data, we need to find the one with matching slug
    const universities = response.data.data?.universities?.data || response.data.data || [];
    const university = universities.find((uni: any) => uni.slug === slug);
    
    if (!university) {
      throw new Error(`University with slug "${slug}" not found`);
    }
    
    return {
      id: university.id,
      name: university.name,
      slug: university.slug
    };
  } catch (error) {
    console.error("Error fetching university by slug:", error);
    throw error;
  }
};

export const getUniversityRankings = async (universityId: number): Promise<UniversityRankingsResponse> => {
  try {
    const response = await api.get<UniversityRankingsResponse>(`/university-ranking/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university rankings:", error);
    throw error;
  }
};

// University Students Interface
export interface UniversityStudent {
  id: number;
  country: string;
  country_iso_code: string | null;
  number_of_students: number;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniversityStudentsResponse {
  data: {
    students: UniversityStudent[];
  };
}

export const getUniversityStudents = async (universityId: number): Promise<UniversityStudentsResponse> => {
  try {
    const response = await api.get<UniversityStudentsResponse>(`/university-students/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university students:", error);
    throw error;
  }
};

// University FMGE Rates Interface
export interface UniversityFMGERate {
  id: number;
  university_id: number;
  year: string;
  total_applications: number;
  accepted_students: number;
  acceptance_rate: string;
  trend: string;
  yoy_change: string;
  created_at: string;
  updated_at: string;
}

export interface UniversityFMGERatesResponse {
  data: {
    fmge_rates: UniversityFMGERate[];
  };
}

export const getUniversityFMGERates = async (universityId: number): Promise<UniversityFMGERatesResponse> => {
  try {
    const response = await api.get<UniversityFMGERatesResponse>(`/university-fmge-rates/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university FMGE rates:", error);
    throw error;
  }
};

// University Intakes Interface
export interface UniversityIntake {
  id: number;
  name: string;
  application_deadline: string | null;
  classes_begin: string | null;
  highlights: string;
  status: number;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniversityIntakesResponse {
  data: {
    intakes: UniversityIntake[];
  };
}

export const getUniversityIntakes = async (universityId: number): Promise<UniversityIntakesResponse> => {
  try {
    const response = await api.get<UniversityIntakesResponse>(`/university-intakes/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university intakes:", error);
    throw error;
  }
};

// University Details Interface
export interface UniversityDetails {
  id: number;
  name: string;
  slug: string;
  thumbnail_name: string;
  thumbnail_path: string;
  brochure_name: string | null;
  brochure_path: string | null;
  is_featured: number;
  city: string | null;
  state: string | null;
  province_id: string;
  city_id: string;
  rating: string;
  established_year: string;
  scholarship_name: string;
  scholarship_amount: string;
  seats_available: number;
  students: number;
  tuition_fee: string;
  approved_by: string | null;
  shortnote: string;
  fmge_pass_rate: string;
  course_duration: string;
  medium_of_instruction: string;
  eligibility: string;
  neet_requirement: string | null;
  about_note: string;
  international_recognition: string | null;
  english_medium: string | null;
  diverse_community: string | null;
  section2_image: string | null;
  section2_title: string | null;
  section2_text: string | null;
  year_of_excellence: string | null;
  countries_represented: string | null;
  global_ranking: string | null;
  campus_area: string | null;
  labs: string | null;
  lecture_hall: string | null;
  hostel_building: string | null;
  parent_satisfaction: string | null;
  total_reviews: string | null;
  recommended_rate: string | null;
  embassy_verified: number;
  who_listed: number;
  nmc_approved: number;
  ministry_licensed: number;
  faimer_listed: number;
  mci_recognition: number;
  ecfmg_eligible: number;
  status: number;
  home_view: number;
  institute_type_id: number;
  created_by: string | null;
  updated_by: string | null;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  og_image_path: string | null;
  seo_rating: string | null;
  review_number: string | null;
  best_rating: string | null;
  created_at: string;
  updated_at: string;
  institute_type: {
    id: number;
    institute_type: string;
    institute_type_slug: string;
    created_at: string;
    updated_at: string;
  };
  get_province: {
    id: number;
    province_name: string;
    province_slug: string;
    created_at: string | null;
    updated_at: string | null;
  };
  get_city: {
    id: number;
    city_name: string;
    city_slug: string;
    province_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface UniversityDetailsSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string | null;
}

export interface UniversityDetailsResponse {
  data: {
    university: UniversityDetails;
    seo: UniversityDetailsSEO;
  };
}

// Get university details by slug
export const getUniversityDetails = async (slug: string): Promise<UniversityDetailsResponse> => {
  try {
    const response = await api.get<UniversityDetailsResponse>(`/university-details/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university details:", error);
    throw error;
  }
};

// University Testimonials Interface
export interface UniversityTestimonial {
  id: number;
  author_name: string;
  author_location: string;
  relation: string;
  author_image: string;
  content: string;
  rating: number;
  student_name: string;
  student_year: string;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniversityTestimonialsResponse {
  message?: string;
  data: {
    testimonials: UniversityTestimonial[];
  };
}

export const getUniversityTestimonials = async (universityId: number): Promise<UniversityTestimonialsResponse> => {
  try {
    const response = await api.get<UniversityTestimonialsResponse>(`/university-testimonials/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university testimonials:", error);
    throw error;
  }
};

// University Reviews Interface
export interface UniversityReview {
  id: number;
  reviewer_name: string;
  reviewer_role: string | null;
  is_verified: number;
  rating: number;
  comment: string;
  reviewed_at: string;
  is_published: number;
  sort_order: number;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniversityReviewsResponse {
  data: {
    reviews: UniversityReview[];
  };
}

export const getUniversityReviews = async (universityId: number): Promise<UniversityReviewsResponse> => {
  try {
    const response = await api.get<UniversityReviewsResponse>(`/university-reviews/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university reviews:", error);
    throw error;
  }
};

// University FAQs Interface
export interface UniversityFAQ {
  id: number;
  question: string;
  answer: string;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniversityFAQsResponse {
  data: {
    faqs: UniversityFAQ[];
  };
}

export const getUniversityFAQs = async (universityId: number): Promise<UniversityFAQsResponse> => {
  try {
    const response = await api.get<UniversityFAQsResponse>(`/university-faqs/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university FAQs:", error);
    throw error;
  }
};

// Scholarships API Interfaces
export interface Scholarship {
  id: number;
  title: string;
  slug: string;
  scholarship_type: string;
  amount_min: string;
  amount_max: string;
  discount_percentage: number;
  deadline: string;
  available_seats: number;
  program: string;
  application_mode: string;
  eligibility: string[];
  coverage: string[];
  is_active: number;
  university_id: number;
  university: {
    id: number;
    name: string;
  };
}

export interface ScholarshipsFilters {
  scholarshipTypes: string[];
  applicationModes: string[];
}

export interface AppliedFilters {
  current_scholarship_type: string | null;
  current_application_mode: string | null;
}

export interface ScholarshipsSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string | null;
}

export interface ScholarshipsResponse {
  data: {
    scholarships: {
      current_page: number;
      data: Scholarship[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: Array<{
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
      }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
    filters: ScholarshipsFilters;
    applied_filters: AppliedFilters;
    seo: ScholarshipsSEO;
  };
}

export interface ScholarshipsParams {
  search?: string;
  scholarship_type?: string;
  application_mode?: string;
  page?: number;
}

export const getScholarships = async (params: ScholarshipsParams = {}): Promise<ScholarshipsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.scholarship_type) queryParams.append('scholarship_type', params.scholarship_type);
    if (params.application_mode) queryParams.append('application_mode', params.application_mode);
    if (params.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/scholarships?${queryString}` : '/scholarships';
    
    const response = await api.get<ScholarshipsResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};

// University Scholarships Interface
export interface UniversityScholarship {
  id: number;
  title: string;
  slug: string;
  scholarship_type: string;
  amount_min: string;
  amount_max: string;
  discount_percentage: number;
  deadline: string;
  available_seats: number;
  program: string;
  application_mode: string;
  eligibility: string[];
  coverage: string[];
  is_active: number;
  university_id: number;
}

export interface UniversityScholarshipsResponse {
  data: {
    scholarships: UniversityScholarship[];
  };
}

export const getUniversityScholarships = async (universityId: number): Promise<UniversityScholarshipsResponse> => {
  try {
    const response = await api.get<UniversityScholarshipsResponse>(`/university-scholarships/${universityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university scholarships:", error);
    throw error;
  }
};

// Blog API Interfaces
export interface BlogCategory {
  id: number;
  category_name: string;
  category_slug: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  email?: string;
  profile_picture?: string;
}

export interface BlogPost {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
  category: BlogCategory;
  author: BlogAuthor | null;
}

export interface BlogSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string | null;
}

export interface BlogPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface BlogPagination {
  current_page: number;
  data: BlogPost[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: BlogPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface BlogResponse {
  blogs: BlogPagination;
  seo: BlogSEO;
}

export interface BlogParams {
  search?: string;
  category?: string;
  page?: number;
}

export const getBlogs = async (params: BlogParams = {}): Promise<BlogResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/blog?${queryString}` : '/blog';
    
    const response = await api.get<BlogResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Blog Detail API Interfaces
export interface BlogChildContent {
  id: number;
  parent_id: number;
  title: string;
  slug: string;
  description: string;
}

export interface BlogParentContent {
  id: number;
  title: string;
  slug: string;
  description: string;
  blog_id: number;
  child_contents: BlogChildContent[];
}

export interface BlogDetailData {
  id: number;
  title: string;
  slug: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
  author_id: number;
  category_id: number;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string | null;
  category: BlogCategory;
  author: BlogAuthor;
  parent_contents: BlogParentContent[];
}

export interface BlogDetailSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string;
}

export interface BlogDetailResponse {
  status: boolean;
  blog: BlogDetailData;
  related_blogs: BlogPost[];
  categories: BlogCategory[];
  seo: BlogDetailSEO;
}

export const getBlogDetail = async (categorySlug: string, slug: string): Promise<BlogDetailResponse> => {
  try {
    const response = await api.get<BlogDetailResponse>(`/blog-details/${categorySlug}/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog detail:", error);
    throw error;
  }
};

// Blog by Category API Interfaces
export interface BlogByCategoryResponse {
  status: boolean;
  category: BlogCategory;
  blogs: BlogPagination;
  seo: BlogSEO;
}

export interface BlogByCategoryParams {
  page?: number;
}

export const getBlogsByCategory = async (categorySlug: string, params: BlogByCategoryParams = {}): Promise<BlogByCategoryResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/blog-by-category/${categorySlug}?${queryString}` : `/blog-by-category/${categorySlug}`;
    
    const response = await api.get<BlogByCategoryResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    throw error;
  }
};

// Home Universities API Interface
export interface HomeUniversity {
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
  seats_available: number;
  institute_type_id: number;
  students: number;
  tuition_fee: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  institute_type: {
    id: number;
    institute_type: string;
    institute_type_slug: string;
    created_at: string;
    updated_at: string;
  };
  get_province: {
    id: number;
    province_name: string;
    province_slug: string;
    created_at: string | null;
    updated_at: string | null;
  };
  get_city: {
    id: number;
    city_name: string;
    city_slug: string;
    province_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface HomeUniversitiesResponse {
  status: boolean;
  message: string;
  data: {
    universities: HomeUniversity[];
  };
}

export const getHomeUniversities = async (): Promise<HomeUniversitiesResponse> => {
  try {
    const response = await api.get<HomeUniversitiesResponse>("/home/universities");
    return response.data;
  } catch (error) {
    console.error("Error fetching home universities:", error);
    throw error;
  }
};

// Compare Universities API Interface
export interface CompareUniversity {
  id: number;
  name: string;
  slug: string;
}

export interface CompareUniversitiesResponse {
  data: {
    universities: CompareUniversity[];
  };
}

export const getCompareUniversities = async (): Promise<CompareUniversitiesResponse> => {
  try {
    const response = await api.get<CompareUniversitiesResponse>("/home/compare-universities");
    return response.data;
  } catch (error) {
    console.error("Error fetching compare universities:", error);
    throw error;
  }
};

// University Detail API for Comparison
export interface UniversityDetailForComparison {
  id: number;
  name: string;
  slug: string;
  thumbnail_name: string;
  thumbnail_path: string;
  brochure_name: string | null;
  brochure_path: string | null;
  is_featured: number;
  city: string | null;
  state: string | null;
  province_id: string;
  city_id: string;
  rating: string | null;
  established_year: string | null;
  scholarship_name: string | null;
  scholarship_amount: string | null;
  seats_available: number | null;
  students: number | null;
  tuition_fee: string | null;
  approved_by: string | null;
  shortnote: string | null;
  fmge_pass_rate: string | null;
  course_duration: string | null;
  medium_of_instruction: string | null;
  eligibility: string | null;
  neet_requirement: string | null;
  about_note: string | null;
  international_recognition: string | null;
  english_medium: string | null;
  diverse_community: string | null;
  section2_image: string | null;
  section2_title: string | null;
  section2_text: string | null;
  year_of_excellence: string | null;
  countries_represented: string | null;
  global_ranking: string | null;
  campus_area: string | null;
  labs: string | null;
  lecture_hall: string | null;
  hostel_building: string | null;
  parent_satisfaction: string | null;
  total_reviews: string | null;
  recommended_rate: string | null;
  embassy_verified: number;
  who_listed: number;
  nmc_approved: number;
  ministry_licensed: number;
  faimer_listed: number;
  mci_recognition: number;
  ecfmg_eligible: number;
  status: number;
  home_view: number;
  institute_type_id: number;
  created_by: string | null;
  updated_by: string | null;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  og_image_path: string | null;
  seo_rating: string | null;
  review_number: string | null;
  best_rating: string | null;
  created_at: string;
  updated_at: string;
  institute_type: {
    id: number;
    institute_type: string;
    institute_type_slug: string;
    created_at: string;
    updated_at: string;
  };
  get_province: {
    id: number;
    province_name: string;
    province_slug: string;
    created_at: string | null;
    updated_at: string | null;
  };
  get_city: {
    id: number;
    city_name: string;
    city_slug: string;
    province_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface UniversityDetailResponse {
  data: {
    university: UniversityDetailForComparison;
  };
}

export const getUniversityDetail = async (id: number): Promise<UniversityDetailResponse> => {
  try {
    const response = await api.get<UniversityDetailResponse>(`/home/university-detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching university detail:", error);
    throw error;
  }
};

// FMGE (Foreign Medical Graduate Exam) data fetch
export const getFMGERates = async () => {
  try {
    const response = await api.get('/home/fmge-rates');
    return response.data;
  } catch (error) {
    console.error('Error fetching FMGE rates:', error);
    throw error;
  }
};

// News API Interfaces
export interface NewsCategory {
  id: number;
  category_name: string;
  category_slug: string;
}

export interface NewsAuthor {
  id: number;
  name?: string;
  email?: string;
  profile_picture?: string;
}

export interface NewsItem {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
  category: NewsCategory;
  author: NewsAuthor | null;
}

export interface NewsSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string | null;
}

export interface NewsPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface NewsPagination {
  current_page: number;
  data: NewsItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: NewsPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface NewsResponse {
  status: boolean;
  news: NewsPagination;
  seo: NewsSEO;
}

export interface NewsParams {
  page?: number;
}

export const getNews = async (params: NewsParams = {}): Promise<NewsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/news?${queryString}` : '/news';
    
    const response = await api.get<NewsResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

// News by Category API Interfaces
export interface NewsByCategoryResponse {
  status: boolean;
  category: NewsCategory;
  news: NewsPagination;
  seo: NewsSEO;
}

export interface NewsByCategoryParams {
  page?: number;
}

export const getNewsByCategory = async (categorySlug: string, params: NewsByCategoryParams = {}): Promise<NewsByCategoryResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/news-by-category/${categorySlug}?${queryString}` : `/news-by-category/${categorySlug}`;
    
    const response = await api.get<NewsByCategoryResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news by category:", error);
    throw error;
  }
};

// News Detail API Interfaces
export interface NewsChildContent {
  id: number;
  title: string;
  slug: string;
  description: string;
  news_id: number;
  child_contents: NewsChildContent[];
}

export interface NewsParentContent {
  id: number;
  title: string;
  slug: string;
  description: string;
  news_id: number;
  child_contents: NewsChildContent[];
}

export interface NewsDetailData {
  id: number;
  title: string;
  slug: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
  author_id: number;
  category_id: number;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  og_image_path: string | null;
  category: NewsCategory;
  author: NewsAuthor;
  parent_contents: NewsParentContent[];
}

export interface RelatedNewsItem {
  id: number;
  title: string;
  slug: string;
  shortnote: string;
  thumbnail_path: string;
  created_at: string;
}

export interface NewsDetailSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string;
}

export interface NewsDetailResponse {
  status: boolean;
  news: NewsDetailData;
  related_news: RelatedNewsItem[];
  categories: NewsCategory[];
  seo: NewsDetailSEO;
}

export const getNewsDetail = async (categorySlug: string, slug: string): Promise<NewsDetailResponse> => {
  try {
    const response = await api.get<NewsDetailResponse>(`/news-details/${categorySlug}/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news detail:", error);
    throw error;
  }
};

// Article API Interfaces
export interface ArticleCategory {
  id: number;
  category_name: string;
  category_slug: string;
}

export interface ArticleAuthor {
  id: number;
  name?: string;
  email?: string;
  profile_picture?: string;
}

export interface Article {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
  category: ArticleCategory;
  author: ArticleAuthor | null;
}

export interface ArticleSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string | null;
}

export interface ArticlePaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface ArticlePagination {
  current_page: number;
  data: Article[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: ArticlePaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ArticleResponse {
  status: boolean;
  articles: ArticlePagination;
  seo: ArticleSEO;
}

export interface ArticleParams {
  page?: number;
  search?: string;
  category?: string;
}

export const getArticles = async (params: ArticleParams = {}): Promise<ArticleResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/article?${queryString}` : '/article';
    
    const response = await api.get<ArticleResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

// Article by Category API Interfaces
export interface ArticleByCategoryResponse {
  status: boolean;
  category: ArticleCategory;
  articles: ArticlePagination;
  seo: ArticleSEO;
}

export interface ArticleByCategoryParams {
  page?: number;
}

export const getArticlesByCategory = async (categorySlug: string, params: ArticleByCategoryParams = {}): Promise<ArticleByCategoryResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/article-by-category/${categorySlug}?${queryString}` : `/article-by-category/${categorySlug}`;
    
    const response = await api.get<ArticleByCategoryResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    throw error;
  }
};

// Article Detail API Interfaces
export interface ArticleChildContent {
  id: number;
  title: string;
  slug: string;
  description: string;
  article_id: number;
  child_contents: ArticleChildContent[];
}

export interface ArticleParentContent {
  id: number;
  title: string;
  slug: string;
  description: string;
  article_id: number;
  child_contents: ArticleChildContent[];
}

export interface ArticleDetailData {
  id: number;
  title: string;
  slug: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
  author_id: number;
  category_id: number;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  og_image_path: string | null;
  category: ArticleCategory;
  author: ArticleAuthor;
  parent_contents: ArticleParentContent[];
}

export interface RelatedArticleItem {
  id: number;
  title: string;
  slug: string;
  shortnote: string;
  thumbnail_path: string;
  created_at: string;
}

export interface ArticleDetailSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string;
}

export interface ArticleDetailResponse {
  status: boolean;
  article: ArticleDetailData;
  related_articles: RelatedArticleItem[];
  categories: ArticleCategory[];
  seo: ArticleDetailSEO;
}

export const getArticleDetail = async (categorySlug: string, slug: string): Promise<ArticleDetailResponse> => {
  try {
    const response = await api.get<ArticleDetailResponse>(`/article-details/${categorySlug}/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching article detail:", error);
    throw error;
  }
};

// Brochure Request API Interfaces
export interface BrochureRequestParams {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  nationality: string;
  source: string;
  source_path: string;
}

export interface BrochureRequestResponse {
  success: boolean;
  message: string;
}

export const submitBrochureRequest = async (params: BrochureRequestParams): Promise<BrochureRequestResponse> => {
  try {
    const queryParams = new URLSearchParams({
      name: params.name,
      email: params.email,
      country_code: params.country_code,
      phone: params.phone,
      nationality: params.nationality,
      source: params.source,
      source_path: params.source_path,
    });
    
    const response = await api.post<BrochureRequestResponse>(
      `/inquiry/brochure-request?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting brochure request:", error);
    throw error;
  }
};

// University Apply API Interfaces
export interface UniversityApplyParams {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  nationality: string;
  source: string;
  source_path: string;
  highest_level_of_education: string;
  interested_university: string;
  interested_program: string;
}

export interface UniversityApplyResponse {
  message: string;
}

export const submitUniversityApply = async (params: UniversityApplyParams): Promise<UniversityApplyResponse> => {
  try {
    const queryParams = new URLSearchParams({
      name: params.name,
      email: params.email,
      country_code: params.country_code,
      phone: params.phone,
      nationality: params.nationality,
      source: params.source,
      source_path: params.source_path,
      highest_level_of_education: params.highest_level_of_education,
      interested_university: params.interested_university,
      interested_program: params.interested_program,
    });
    
    const response = await api.post<UniversityApplyResponse>(
      `/inquiry/university-apply?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting university apply:", error);
    throw error;
  }
};

// Contact Us API Interfaces
export interface ContactUsParams {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  inquiry_type: string;
  subject: string;
  message: string;
}

export interface ContactUsResponse {
  success: boolean;
  message: string;
}

export const submitContactUs = async (params: ContactUsParams): Promise<ContactUsResponse> => {
  // Build query params
  const queryParams = new URLSearchParams();
  queryParams.append('name', params.name);
  queryParams.append('email', params.email);
  queryParams.append('country_code', params.country_code);
  queryParams.append('phone', params.phone || '');
  queryParams.append('inquiry_type', params.inquiry_type);
  queryParams.append('subject', params.subject);
  queryParams.append('message', params.message);
  
  // Try using the main API instance first (as shown in example URL)
  try {
    const response = await api.post<ContactUsResponse>(
      `/inquiry/contact-us?${queryParams.toString()}`,
      {} // Empty body for POST with query params
    );
    return response.data;
  } catch (mainApiError: any) {
    // If main API fails, try the alternative URL
    console.log("Main API failed, trying alternative URL...", mainApiError);
    
    try {
      const contactApi = axios.create({
        baseURL: "https://admin.mymbbsinvietnam.com/api",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      
      const response = await contactApi.post<ContactUsResponse>(
        `/inquiry/contact-us?${queryParams.toString()}`,
        {}
      );
      return response.data;
    } catch (altApiError: any) {
      // Both APIs failed, log the error and throw
      console.error("Error submitting contact us form - both APIs failed");
      console.error("Main API error:", mainApiError);
      console.error("Alternative API error:", altApiError);
      
      // Log more details about the last error
      if (altApiError.response) {
        console.error("Error response data:", altApiError.response.data);
        console.error("Error response status:", altApiError.response.status);
        console.error("Error response headers:", altApiError.response.headers);
      } else if (altApiError.request) {
        console.error("Error request:", altApiError.request);
      } else {
        console.error("Error message:", altApiError.message);
      }
      
      // Throw the alternative API error as it's the most recent
      throw altApiError;
    }
  }
};

// Student Registration API Interfaces
export interface StudentRegistrationParams {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface StudentRegistrationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    email: string;
  };
}

export const registerStudent = async (params: StudentRegistrationParams): Promise<StudentRegistrationResponse> => {
  try {
    const queryParams = new URLSearchParams({
      name: params.name,
      email: params.email,
      country_code: params.country_code,
      phone: params.phone,
      password: params.password,
      confirm_password: params.confirm_password,
    });
    
    const response = await api.post<StudentRegistrationResponse>(
      `/student/register?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error registering student:", error);
    throw error;
  }
};

// Student Login API Interfaces
export interface StudentLoginParams {
  email: string;
  password: string;
}

export interface StudentLoginResponse {
  data: {
    id: number;
    email: string;
    token: string;
  };
}

export const loginStudent = async (params: StudentLoginParams): Promise<StudentLoginResponse> => {
  try {
    const response = await api.post<StudentLoginResponse>(
      '/student/login',
      {
        email: params.email,
        password: params.password
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in student:", error);
    throw error;
  }
};

// Password reset request
export interface PasswordResetResponse {
  message: string;
  data?: {
    email: string;
    reset_link: string;
    token_expiry: string;
  };
}

export const requestPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  try {
    const response = await api.post<PasswordResetResponse>(
      `/student/forget-password?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

export interface ResetPasswordParams {
  uid: string;
  token: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ResetPasswordResponse {
  status?: boolean;
  message: string;
  data?: {
    token?: string;
    id?: number | string;
    email?: string;
    [key: string]: unknown;
  };
}

export const resetPassword = async (params: ResetPasswordParams): Promise<ResetPasswordResponse> => {
  try {
    const queryParams = new URLSearchParams({
      uid: params.uid,
      token: params.token,
      new_password: params.new_password,
      confirm_new_password: params.confirm_new_password,
    });

    const response = await api.post<ResetPasswordResponse>(
      `/student/reset-password?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// OTP Verification API Interfaces
export interface OTPVerificationParams {
  id: number;
  otp: string;
}

export interface OTPVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    token: string;
  };
}

// Create a separate axios instance for the OTP verification endpoint
const otpApi = axios.create({
  baseURL: "https://admin.mymbbsinvietnam.com/api",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": API_KEY,
  },
});

export const verifyOTP = async (params: OTPVerificationParams): Promise<OTPVerificationResponse> => {
  try {
    // Using POST request with query parameters as shown in the example URL
    const response = await otpApi.post<OTPVerificationResponse>(
      `/student/verify-otp?id=${params.id}&otp=${params.otp}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// Resend OTP API Interfaces
export interface ResendOTPParams {
  id: number;
}

export interface ResendOTPResponse {
  status: boolean;
  message: string;
}

export const resendOTP = async (params: ResendOTPParams): Promise<ResendOTPResponse> => {
  try {
    const response = await otpApi.post<ResendOTPResponse>(
      '/student/resend-otp',
      {
        id: params.id
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
};

// Team API Interfaces
export interface TeamMember {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  login_count: number;
  last_login: string;
  role: string;
  status: number;
  designation: string;
  profile_picture: string;
  about_me: string | null;
  experience_years: number | null;
  phone: string | null;
  working_hours: string | null;
  specializations: string | null;
  languages: string | null;
  badge: string | null;
  created_at: string;
  updated_at: string;
  otp: string | null;
  otp_expire_at: string | null;
}

export interface TeamResponse {
  data: {
    users: TeamMember[];
  };
}

export interface TeamParams {
  limit?: number;
}

export const getTeamMembers = async (params: TeamParams = {}): Promise<TeamResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/team?${queryString}` : '/team';
    
    const response = await api.get<TeamResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
};

// Offices API Interfaces
export interface Office {
  id: number;
  office_name: string;
  location_name: string;
  address_line: string;
  phone: string;
  email: string;
  working_hours: string;
  photo: string;
  latitude_longitude: string;
  created_at: string;
  updated_at: string;
}

export interface OfficesResponse {
  data: {
    offices: Office[];
  };
}

export const getOffices = async (): Promise<OfficesResponse> => {
  try {
    const response = await api.get<OfficesResponse>('/offices');
    return response.data;
  } catch (error) {
    console.error("Error fetching offices:", error);
    throw error;
  }
};

// Scholarship Detail API Interfaces
export interface ScholarshipDetailData {
  id: number;
  title: string;
  slug: string;
  scholarship_type: string;
  amount_min: string;
  amount_max: string;
  discount_percentage: number;
  deadline: string;
  available_seats: number;
  program: string;
  application_mode: string;
  eligibility: string;
  coverage: string;
  shortnote: string;
  overview: string | null;
  how_to_apply: string | null;
  mandatory_documents: string | null;
  optional_documents: string | null;
  duration: string | null;
  application_open_date: string | null;
  interview_period: string | null;
  result_announcement_date: string | null;
  fee_payment_deadline: string | null;
  is_active: number;
  university_id: number;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  og_image_path: string | null;
  seo_rating: string | null;
  review_number: string | null;
  best_rating: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipDetailSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string | null;
}

export interface ScholarshipDetailResponse {
  data: {
    scholarship: ScholarshipDetailData;
    seo: ScholarshipDetailSEO;
  };
}

export const getScholarshipDetail = async (slug: string): Promise<ScholarshipDetailResponse> => {
  try {
    const response = await api.get<ScholarshipDetailResponse>(`/scholarship-detail/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching scholarship detail:", error);
    throw error;
  }
};

// Scholarship FAQ API Interfaces
export interface ScholarshipFAQ {
  id: number;
  scholarship_id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipFAQResponse {
  data: {
    faqs: ScholarshipFAQ[];
  };
}

export const getScholarshipFaqs = async (scholarshipId: number): Promise<ScholarshipFAQResponse> => {
  try {
    const response = await api.get<ScholarshipFAQResponse>(`/scholarship-faqs/${scholarshipId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching scholarship FAQs:", error);
    throw error;
  }
};

// Function to fetch multiple scholarships for homepage
export const getHomepageScholarships = async (): Promise<ScholarshipDetailResponse[]> => {
  try {
    // For now, we'll fetch a few specific scholarships by their slugs
    // You can modify this to fetch from a different endpoint if available
    const scholarshipSlugs = [
      'merit-based-scholarship',
      'government-scholarship',
      'medical-excellence-scholarship',
      'technical-innovation-scholarship'
    ];
    
    const scholarshipPromises = scholarshipSlugs.map(slug => 
      getScholarshipDetail(slug).catch(error => {
        console.warn(`Failed to fetch scholarship ${slug}:`, error);
        return null;
      })
    );
    
    const results = await Promise.all(scholarshipPromises);
    return results.filter(result => result !== null) as ScholarshipDetailResponse[];
  } catch (error) {
    console.error("Error fetching homepage scholarships:", error);
    throw error;
  }
};

// Ministry Links API Interfaces
export interface MinistryLink {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  key_services: string;
  created_at: string;
  updated_at: string;
}

export interface MinistryLinksResponse {
  data: {
    data: MinistryLink[];
  };
}

export const getMinistryLinks = async (): Promise<MinistryLinksResponse> => {
  try {
    const response = await api.get<MinistryLinksResponse>("/official-government-links");
    return response.data;
  } catch (error) {
    console.error("Error fetching ministry links:", error);
    throw error;
  }
};

// Non-University Scholarships API Interfaces
export interface NonUniversityScholarship {
  id: number;
  title: string;
  slug: string;
  scholarship_type: string;
  amount_min: string;
  amount_max: string;
  discount_percentage: number;
  deadline: string;
  available_seats: number;
  program: string;
  application_mode: string;
  eligibility: string[];
  coverage: string[];
  is_active: number;
}

export interface NonUniversityScholarshipsResponse {
  data: {
    scholarships: NonUniversityScholarship[];
  };
}

export const getNonUniversityScholarships = async (): Promise<NonUniversityScholarshipsResponse> => {
  try {
    const response = await api.get<NonUniversityScholarshipsResponse>("/non-university-scholarships");
    return response.data;
  } catch (error) {
    console.error("Error fetching non-university scholarships:", error);
    throw error;
  }
};

// FAQ API Interfaces
export interface FAQItem {
  id: number;
  category_id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface FAQResponse {
  data: {
    faqs: FAQItem[];
  };
}

export const getFAQs = async (categorySlug: string): Promise<FAQResponse> => {
  try {
    const response = await api.get<FAQResponse>(`/faqs/${categorySlug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
};


// Education System API Interfaces
export interface EducationLevel {
  id: number;
  level: string;
  age_range: string;
  duration_years: number;
  is_compulsory: number;
  number_of_schools: string;
  title: string;
  description: string;
  page_id: number;
  created_at: string;
  updated_at: string;
}

export interface EducationExamination {
  id: number;
  exam_name: string;
  grade_level: string;
  type: string;
  subjects: string;
  page_id: number;
  created_at: string;
  updated_at: string;
}

export interface EducationField {
  id: number;
  field: string;
  description: string;
  number_of_institutions: string;
  duration_years: string;
  page_id: number;
  created_at: string;
  updated_at: string;
}

export interface EducationDegree {
  id: number;
  degree: string;
  duration: string;
  ects_credits: string;
  recognition: string;
  page_id: number;
  created_at: string;
  updated_at: string;
}

export interface EducationSystemInfo {
  id: number;
  title: string;
  description: string;
  introduction_title: string;
  introduction_description: string;
  government_regulation: string;
  cultural_importance: string;
  continuous_development: string;
  literacy_rate: string;
  primary_enrollment: string;
  secondary_completion: string;
  higher_institutions_count: number;
  school_education_structure_description: string;
  examination_system_description: string;
  languages_instruction_description: string;
  official_state_language: string;
  official_state_language_percentage: string;
  official_state_language_note: string;
  official_language: string;
  official_language_percentage: string;
  official_language_note: string;
  foreign_language: string;
  foreign_language_percentage: string;
  foreign_language_note: string;
  higher_education_description: string;
  universities_count: number;
  universities_note: string;
  academies_count: number;
  academies_note: string;
  institutes_count: number;
  institutes_note: string;
  bologna_process_alignment: string;
  created_at: string;
  updated_at: string;
  levels: EducationLevel[];
  examinations: EducationExamination[];
  fields: EducationField[];
  degrees: EducationDegree[];
}

export interface EducationSystemResponse {
  data: {
    info: EducationSystemInfo;
  };
}

export const getEducationSystem = async (): Promise<EducationSystemResponse> => {
  try {
    const response = await api.get<EducationSystemResponse>("/education-system");
    return response.data;
  } catch (error) {
    console.error("Error fetching education system:", error);
    throw error;
  }
};

// About Us API Interfaces
export interface AboutUsInfo {
  id: number;
  hero_title: string;
  hero_description: string;
  button1_label: string;
  button1_link: string;
  button2_label: string;
  button2_link: string;
  partner_universities: number;
  students_placed: number;
  channel_partners: number;
  years_experience: number;
  mission: string;
  vision: string;
  why_choose_us: string;
  service_description: string;
  university_listings: string;
  student_counseling: string;
  admission_assistance: string;
  international_support: string;
  partner_with_us: string;
  partner_benefits: string;
  why_study_mbbs_title: string;
  why_study_mbbs_description: string;
  contact1: string;
  contact2: string;
  email1: string;
  email2: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface AboutUsResponse {
  data: {
    info: AboutUsInfo;
  };
}

export const getAboutUs = async (): Promise<AboutUsResponse> => {
  try {
    const response = await api.get<AboutUsResponse>("/about-us");
    return response.data;
  } catch (error) {
    console.error("Error fetching about us data:", error);
    throw error;
  }
};

// University Programs API Interfaces
export interface UniversityProgram {
  id: number;
  program_name: string;
  program_slug: string;
  duration: string;
  level_id: number;
  study_mode: string;
  total_fee: string;
  total_tuition_fee: string;
  annual_tuition_fee: string;
  currency: string;
  application_deadline: string;
  intake: string;
  is_active: number;
  sort_order: number;
  overview: string;
  eligibility: string;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  og_image_path: string | null;
  seo_rating: string | null;
  review_number: string | null;
  best_rating: string | null;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniversityProgramsResponse {
  data: {
    programs: UniversityProgram[];
  };
}

export interface UniversityProgramsParams {
  limit?: number;
}

export const getUniversityPrograms = async (universityId: number, params: UniversityProgramsParams = {}): Promise<UniversityProgramsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/university-programs/${universityId}?${queryString}` : `/university-programs/${universityId}`;
    
    const response = await api.get<UniversityProgramsResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching university programs:", error);
    throw error;
  }
};

// Program Details API Interfaces
export interface ProgramDetails {
  id: number;
  program_name: string;
  program_slug: string;
  duration: string;
  level_id: number;
  study_mode: string;
  total_fee: string;
  total_tuition_fee: string;
  annual_tuition_fee: string;
  currency: string;
  application_deadline: string;
  intake: string;
  is_active: number;
  sort_order: number;
  overview: string;
  eligibility: string;
  medium_of_instruction: string;
  recognition: string;
  why_choose_kyrgyzstan: string;
  additional_information: string;
  year1_syllabus: string;
  year2_syllabus: string;
  year3_syllabus: string;
  year4_syllabus: string;
  year5_syllabus: string;
  year6_syllabus: string;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  og_image_path: string | null;
  seo_rating: string | null;
  review_number: string | null;
  best_rating: string | null;
  university_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramDetailsSEO {
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  og_image_path: string | null;
}

export interface ProgramDetailsResponse {
  data: {
    program: ProgramDetails;
    seo: ProgramDetailsSEO;
  };
}

export interface ProgramDetailsParams {
  limit?: number;
}

export const getProgramDetails = async (
  universityId: number,
  programSlug: string,
  params: ProgramDetailsParams = {}
): Promise<ProgramDetailsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString
      ? `/program-details/${universityId}/${programSlug}?${queryString}`
      : `/program-details/${universityId}/${programSlug}`;
    
    const response = await api.get<ProgramDetailsResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching program details:", error);
    throw error;
  }
};

// About Country API Interfaces
export interface AboutCountryCuisine {
  id: number;
  dish_name: string;
  dish_description: string;
  dish_image: string | null;
  icon_class: string | null;
  page_id: number;
  created_at: string;
  updated_at: string;
}

export interface AboutCountryCulture {
  id: number;
  title: string;
  description: string;
  icon_class: string | null;
  image: string | null;
  page_id: number;
  created_at: string;
  updated_at: string;
}

export interface AboutCountryMajorCity {
  id: number;
  city_name: string;
  description: string;
  population: string;
  highlights: string;
  city_image: string | null;
  page_id: number;
  created_at: string;
  updated_at: string;
}

export interface AboutCountryAttraction {
  id: number;
  attraction_name: string;
  description: string;
  ordering: number | null;
  is_active: number;
  image: string | null;
  icon_class: string | null;
  page_id: number;
  created_at: string;
  updated_at: string;
}

export interface AboutCountryInfo {
  id: number;
  name: string;
  tagline: string;
  capital: string;
  population: string;
  languages: string;
  currency: string | null;
  location: string | null;
  timezone: string | null;
  independence_day: string;
  highest_peak: string;
  highest_peak_height: string;
  mountain_ranges: string;
  climate_zones: string;
  top_attractions: string | null;
  ancient_silk_road: string;
  nomadic_heritage: string;
  religion_diversity: string;
  cultural_highlights: string;
  who_recognized: number;
  mbbs_affordable_education: string | null;
  english_medium: number;
  academic_excellence: string;
  student_life: string;
  key_sectors: string;
  major_exports: string;
  investment_opportunities: string;
  gdp_growth: string;
  main_industries: string;
  tourism_growth: string;
  hydropower_potential: string;
  transportation: string;
  visa_connectivity: string;
  public_healthcare: string;
  private_healthcare: string;
  student_healthcare: string;
  national_sport: string;
  unesco_sites: string;
  banner_image: string;
  created_at: string;
  updated_at: string;
  cuisines: AboutCountryCuisine[];
  cultures: AboutCountryCulture[];
  major_cities: AboutCountryMajorCity[];
  attractions: AboutCountryAttraction[];
}

export interface AboutCountryResponse {
  data: {
    info: AboutCountryInfo;
  };
}

export const getAboutCountry = async (): Promise<AboutCountryResponse> => {
  try {
    const response = await api.get<AboutCountryResponse>("/about-country");
    return response.data;
  } catch (error) {
    console.error("Error fetching about country data:", error);
    throw error;
  }
};

// Student Profile API Interfaces
export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  email_verified: number;
  registered: number;
  country_code: number | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  nationality: string | null;
  date_of_birth: string | null;
  passport_number: string | null;
  passport_expiry_date: string | null;
  current_education_level: string | null;
  interested_university: string | null;
  interested_program: string | null;
  father_name: string | null;
  father_mobile: string | null;
  mother_name: string | null;
  mother_mobile: string | null;
  first_language: string | null;
  country_of_citizenship: string | null;
  gender: string | null;
  marital_status: string | null;
  home_contact_number: string | null;
  country_of_education: string | null;
  highest_level_of_education: string | null;
  grading_scheme: string | null;
  grade_average: string | null;
  english_exam_type: string | null;
  date_of_exam: string | null;
  listening_score: string | null;
  reading_score: string | null;
  writing_score: string | null;
  speaking_score: string | null;
  overall_score: string | null;
  neet_qualification_status: string | null;
  neet_score: string | null;
  source: string | null;
  source_path: string | null;
  password: string;
  email_verified_at: string | null;
  otp: string | null;
  otp_expire_at: string | null;
  remember_token: string | null;
  status: number;
  inquiry_type: string | null;
  subject: string | null;
  message: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentProfileResponse {
  data: {
    student: StudentProfile;
  };
}

export const getStudentProfile = async (): Promise<StudentProfileResponse> => {
  try {
    const response = await api.get<StudentProfileResponse>("/student/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
};

// Update Personal Information API Interfaces
export interface UpdatePersonalInformationParams {
  name: string;
  email: string;
  phone: string;
  country_code: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  first_language: string;
  nationality: string;
  passport_number: string;
  passport_expiry_date: string;
  marital_status: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  home_contact_number: string;
}

export interface UpdatePersonalInformationResponse {
  status?: boolean;
  message: string;
  data?: any;
}

export const updatePersonalInformation = async (
  params: UpdatePersonalInformationParams
): Promise<UpdatePersonalInformationResponse> => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      // API expects string values, ensure empty string when value is falsy
      queryParams.append(key, value ?? "");
    });

    const response = await api.post<UpdatePersonalInformationResponse>(
      `/student/personal-information?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating personal information:", error);
    throw error;
  }
};

// Fetch Personal Information API Interfaces
export interface PersonalInformationData {
  name?: string;
  email?: string;
  phone?: string;
  country_code?: string | number | null;
  father_name?: string;
  mother_name?: string;
  date_of_birth?: string;
  first_language?: string;
  nationality?: string;
  passport_number?: string;
  passport_expiry_date?: string;
  marital_status?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  home_contact_number?: string;
  country_of_citizenship?: string;
}

export interface PersonalInformationResponse {
  status?: boolean;
  message?: string;
  data?: PersonalInformationData | { personal_information?: PersonalInformationData };
  personal_information?: PersonalInformationData;
}

export const getPersonalInformation = async (): Promise<PersonalInformationData | null> => {
  try {
    const response = await api.get<PersonalInformationResponse>("/student/personal-information");
    const payload = response.data;
    const { data, personal_information } = payload;

    if (personal_information && typeof personal_information === "object") {
      return personal_information;
    }

    if (data) {
      if ("personal_information" in data && data.personal_information) {
        return data.personal_information as PersonalInformationData;
      }
      return data as PersonalInformationData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching personal information:", error);
    throw error;
  }
};

// Student Logout API Interfaces
export interface StudentLogoutResponse {
  status: boolean;
  message: string;
}

export const logoutStudent = async (): Promise<StudentLogoutResponse> => {
  try {
    const response = await api.post<StudentLogoutResponse>("/student/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out student:", error);
    throw error;
  }
};

// Education Summary API Interface
export interface EducationSummaryParams {
  country_of_education: string;
  highest_level_of_education: string;
  grading_scheme: string;
  grade_average: string;
}

export interface EducationSummaryResponse {
  status: boolean;
  message: string;
  data?: any;
}

export const updateEducationSummary = async (params: EducationSummaryParams): Promise<EducationSummaryResponse> => {
  try {
    const response = await api.post<EducationSummaryResponse>(
      '/student/education-summary',
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error updating education summary:", error);
    throw error;
  }
};

// Test Score API Interfaces
export interface UpdateTestScoreParams {
  english_exam_type: string;
  date_of_exam: string;
  listening_score?: string;
  reading_score?: string;
  speaking_score?: string;
  writing_score?: string;
  overall_score?: string;
}

export interface UpdateTestScoreResponse {
  status?: boolean;
  message: string;
}

export const updateTestScore = async (params: UpdateTestScoreParams): Promise<UpdateTestScoreResponse> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      // Include all values except undefined and null (empty strings are allowed for unused fields)
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    const response = await api.post<UpdateTestScoreResponse>(
      `/student/update-test-score?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating test score:", error);
    throw error;
  }
};

// Upload Student Document API Interfaces
export interface UploadStudentDocumentParams {
  document_name: string;
  file: File | Blob;
}

export interface UploadStudentDocumentResponse {
  status?: boolean;
  message: string;
  data?: any;
}

export const uploadStudentDocument = async (
  params: UploadStudentDocumentParams
): Promise<UploadStudentDocumentResponse> => {
  try {
    const formData = new FormData();
    formData.append('document_name', params.document_name);
    formData.append('file', params.file);

    const response = await api.post<UploadStudentDocumentResponse>(
      '/student/upload-documents',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading student document:', error);
    throw error;
  }
};

// Fetch Student Documents API Interfaces
export interface StudentDocument {
  id: number;
  student_id: number;
  document_name: string;
  file_name: string;
  file_path: string;
  upload_by: string | null;
  document_status: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface GetStudentDocumentsResponse {
  status?: boolean;
  message?: string;
  data?: {
    student_documents: StudentDocument[];
  };
  student_documents?: StudentDocument[];
}

export const getStudentDocuments = async (): Promise<GetStudentDocumentsResponse> => {
  try {
    const response = await api.get<GetStudentDocumentsResponse>('/student/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching student documents:', error);
    throw error;
  }
};

// Change Password API Interfaces
export interface ChangePasswordParams {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (params: ChangePasswordParams): Promise<ChangePasswordResponse> => {
  try {
    const queryParams = new URLSearchParams({
      old_password: params.old_password,
      new_password: params.new_password,
      confirm_new_password: params.confirm_new_password,
    });
    
    const response = await api.post<ChangePasswordResponse>(
      `/student/change-password?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Add School API Interfaces
export interface AddSchoolParams {
  country_of_institution: string;
  name_of_institution: string;
  level_of_education: string;
  primary_language_of_instruction: string;
  attended_institution_from: string;
  attended_institution_to: string;
  degree_name: string;
  graduated_from_this: number; // 1 for Yes, 0 for No
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface AddSchoolResponse {
  message: string;
}

export const addSchool = async (params: AddSchoolParams): Promise<AddSchoolResponse> => {
  try {
    const queryParams = new URLSearchParams({
      country_of_institution: params.country_of_institution,
      name_of_institution: params.name_of_institution,
      level_of_education: params.level_of_education,
      primary_language_of_instruction: params.primary_language_of_instruction,
      attended_institution_from: params.attended_institution_from,
      attended_institution_to: params.attended_institution_to,
      degree_name: params.degree_name,
      graduated_from_this: params.graduated_from_this.toString(),
      address: params.address,
      city: params.city,
      state: params.state,
      zipcode: params.zipcode,
    });
    
    const response = await api.post<AddSchoolResponse>(
      `/student/add-school?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error adding school:", error);
    throw error;
  }
};

// Update School API Interfaces
export interface UpdateSchoolParams {
  id: string | number;
  country_of_institution: string;
  name_of_institution: string;
  level_of_education: string;
  primary_language_of_instruction: string;
  attended_institution_from: string;
  attended_institution_to: string;
  degree_name: string;
  graduated_from_this: number; // 1 for Yes, 0 for No
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface UpdateSchoolResponse {
  status?: boolean;
  message: string;
}

export const updateSchool = async (params: UpdateSchoolParams): Promise<UpdateSchoolResponse> => {
  try {
    const queryParams = new URLSearchParams({
      id: params.id.toString(),
      country_of_institution: params.country_of_institution,
      name_of_institution: params.name_of_institution,
      level_of_education: params.level_of_education,
      primary_language_of_instruction: params.primary_language_of_instruction,
      attended_institution_from: params.attended_institution_from,
      attended_institution_to: params.attended_institution_to,
      degree_name: params.degree_name,
      graduated_from_this: params.graduated_from_this.toString(),
      address: params.address,
      city: params.city,
      state: params.state,
      zipcode: params.zipcode,
    });
    
    const response = await api.post<UpdateSchoolResponse>(
      `/student/update-school?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating school:", error);
    throw error;
  }
};

// Get Attended Schools API Interfaces
export interface AttendedSchool {
  id: number;
  student_id: number;
  country_of_institution: string;
  name_of_institution: string;
  level_of_education: string;
  primary_language_of_instruction: string;
  attended_institution_from: string;
  attended_institution_to: string;
  degree_name: string;
  graduated_from_this: number;
  graduation_date: string | null;
  have_physical_certificate: number;
  study_mode: string | null;
  address: string;
  city: string;
  state: string | null;
  zipcode: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetAttendedSchoolsResponse {
  status: boolean;
  message?: string;
  data: {
    schools: AttendedSchool[];
  };
}

export const getAttendedSchools = async (): Promise<GetAttendedSchoolsResponse> => {
  try {
    const response = await api.get<GetAttendedSchoolsResponse>("/student/schools");
    return response.data;
  } catch (error) {
    console.error("Error fetching attended schools:", error);
    throw error;
  }
};

// Get Single School Details API Interfaces
export interface GetSchoolDetailsResponse {
  status: boolean;
  message?: string;
  data: {
    school: AttendedSchool;
  };
}

export const getSchoolDetails = async (id: string | number): Promise<GetSchoolDetailsResponse> => {
  try {
    const response = await api.get<GetSchoolDetailsResponse>(`/student/school/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching school details:", error);
    throw error;
  }
};

// Delete School API Interfaces
export interface DeleteSchoolResponse {
  status: boolean;
  message: string;
}

export const deleteSchool = async (id: string | number): Promise<DeleteSchoolResponse> => {
  try {
    const response = await api.delete<DeleteSchoolResponse>(`/student/delete-school/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting school:", error);
    throw error;
  }
};

// Page Content API Interfaces
export interface PageContentData {
  id: number;
  page_name: string;
  title: string | null;
  content: string;
  image: string | null;
  author_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface PageContentResponse {
  data: {
    data: PageContentData;
  };
}

export const getPageContent = async (pageSlug: string): Promise<PageContentResponse> => {
  try {
    const response = await api.get<PageContentResponse>(`/page-content/${pageSlug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching page content:", error);
    throw error;
  }
};

export default api;
