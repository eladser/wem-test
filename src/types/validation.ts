
export interface ValidationRule<T = any> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors: Record<string, string[]>;
}

export interface ValidatedField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  isValid: boolean;
}

export interface FormValidationSchema {
  [fieldName: string]: ValidationRule;
}

export type ValidatorFunction<T = any> = (value: T, rules: ValidationRule) => string[];

export interface AsyncValidationRule<T = any> extends ValidationRule<T> {
  asyncValidator?: (value: T) => Promise<boolean | string>;
}

export interface ValidationContext {
  formData: Record<string, any>;
  fieldName: string;
  allFields: Record<string, any>;
}
