import { UserRole, ApplicationStatus, NewsStatus, EventCategory, Gender } from "@prisma/client";

export type { UserRole, ApplicationStatus, NewsStatus, EventCategory, Gender };

export interface NavItem {
  label: string;
  href:  string;
  children?: NavItem[];
}

export interface PageMeta {
  title:       string;
  description: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?:   T;
  error?:  string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total:   number;
  page:    number;
  perPage: number;
  pages:   number;
}

export type SessionUser = {
  id:    string;
  name:  string;
  email: string;
  role:  UserRole;
  image?: string;
};
