
export type Category = 'Banner' | 'Poster' | 'Visiting Card' | 'Thumbnail' | 'Social Media';

export type SubCategory = 
  | 'Website Banner' | 'Event Banner' | 'Promotional Banner'
  | 'Event Poster' | 'Product Poster' | 'Advertising Poster'
  | 'Company Card' | 'Personal Card' | 'Branding Card'
  | 'YouTube Thumbnail' | 'Product Thumbnail'
  | 'Facebook Post' | 'Facebook Cover' | 'Instagram Post' | 'Instagram Story' | 'Twitter Post' | 'LinkedIn Post';

export interface Project {
  id: string;
  name: string;
  category: Category;
  subcategory: SubCategory;
  description: string;
  imageUrl: string;
  link?: string;
  createdAt: number;
}

export interface Order {
  id: string;
  clientName: string;
  email: string;
  whatsapp: string;
  phone?: string;
  projectType: string;
  details: string;
  fileUrl?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: number;
}

export const CATEGORIES: Record<Category, SubCategory[]> = {
  'Banner': ['Website Banner', 'Event Banner', 'Promotional Banner'],
  'Poster': ['Event Poster', 'Product Poster', 'Advertising Poster'],
  'Visiting Card': ['Company Card', 'Personal Card', 'Branding Card'],
  'Thumbnail': ['YouTube Thumbnail', 'Product Thumbnail'],
  'Social Media': ['Facebook Post', 'Facebook Cover', 'Instagram Post', 'Instagram Story', 'Twitter Post', 'LinkedIn Post']
};
