
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationParams;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ThemeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
