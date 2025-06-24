
import { ComponentSize, ComponentVariant, ThemeColor } from './common';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ComponentVariant;
  size?: ComponentSize;
  loading?: boolean;
  icon?: React.ComponentType<any>;
  fullWidth?: boolean;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: ComponentSize;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ComponentVariant;
  size?: ComponentSize;
  color?: ThemeColor;
}

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  size?: ComponentSize;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ComponentSize;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}
