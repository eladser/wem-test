import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Breakpoint definitions (Tailwind CSS breakpoints)
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

// Screen size context
interface ScreenContext {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: Breakpoint;
  isBreakpoint: (breakpoint: Breakpoint) => boolean;
  isMinBreakpoint: (breakpoint: Breakpoint) => boolean;
  isMaxBreakpoint: (breakpoint: Breakpoint) => boolean;
  orientation: 'portrait' | 'landscape';
}

const ScreenSizeContext = createContext<ScreenContext | undefined>(undefined);

// Hook to use screen context
export const useScreenSize = (): ScreenContext => {
  const context = useContext(ScreenSizeContext);
  if (!context) {
    throw new Error('useScreenSize must be used within a ResponsiveWrapper');
  }
  return context;
};

// Hook for responsive values
export const useResponsiveValue = <T>(
  values: Partial<Record<Breakpoint | 'base', T>>
): T => {
  const { currentBreakpoint, width } = useScreenSize();
  
  // Find the appropriate value based on current breakpoint
  const breakpointOrder: (Breakpoint | 'base')[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  let selectedValue = values.base;
  
  for (const bp of breakpointOrder) {
    if (bp === 'base') continue;
    
    if (width >= BREAKPOINTS[bp as Breakpoint] && values[bp] !== undefined) {
      selectedValue = values[bp];
    }
  }
  
  return selectedValue as T;
};

// Media query hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);
  
  return matches;
};

// Responsive grid component
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: Partial<Record<Breakpoint | 'base', number>>;
  gap?: Partial<Record<Breakpoint | 'base', number>>;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { base: 1, md: 2, lg: 3 },
  gap = { base: 4 },
  className
}) => {
  const columns = useResponsiveValue(cols);
  const gapValue = useResponsiveValue(gap);
  
  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${columns}`,
        `gap-${gapValue}`,
        className
      )}
    >
      {children}
    </div>
  );
};

// Responsive flex component
interface ResponsiveFlexProps {
  children: ReactNode;
  direction?: Partial<Record<Breakpoint | 'base', 'row' | 'col'>>;
  align?: Partial<Record<Breakpoint | 'base', 'start' | 'center' | 'end' | 'stretch'>>;
  justify?: Partial<Record<Breakpoint | 'base', 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>>;
  gap?: Partial<Record<Breakpoint | 'base', number>>;
  wrap?: Partial<Record<Breakpoint | 'base', boolean>>;
  className?: string;
}

export const ResponsiveFlex: React.FC<ResponsiveFlexProps> = ({
  children,
  direction = { base: 'col', md: 'row' },
  align = { base: 'start' },
  justify = { base: 'start' },
  gap = { base: 4 },
  wrap = { base: false },
  className
}) => {
  const flexDirection = useResponsiveValue(direction);
  const alignItems = useResponsiveValue(align);
  const justifyContent = useResponsiveValue(justify);
  const gapValue = useResponsiveValue(gap);
  const flexWrap = useResponsiveValue(wrap);
  
  const directionClass = flexDirection === 'row' ? 'flex-row' : 'flex-col';
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }[alignItems];
  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }[justifyContent];
  
  return (
    <div
      className={cn(
        'flex',
        directionClass,
        alignClass,
        justifyClass,
        `gap-${gapValue}`,
        flexWrap ? 'flex-wrap' : 'flex-nowrap',
        className
      )}
    >
      {children}
    </div>
  );
};

// Responsive text component
interface ResponsiveTextProps {
  children: ReactNode;
  size?: Partial<Record<Breakpoint | 'base', 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'>>;
  weight?: Partial<Record<Breakpoint | 'base', 'normal' | 'medium' | 'semibold' | 'bold'>>;
  color?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = { base: 'base' },
  weight = { base: 'normal' },
  color,
  className,
  as: Component = 'span'
}) => {
  const fontSize = useResponsiveValue(size);
  const fontWeight = useResponsiveValue(weight);
  
  const sizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  }[fontSize];
  
  const weightClass = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }[fontWeight];
  
  return (
    <Component
      className={cn(
        sizeClass,
        weightClass,
        color,
        className
      )}
    >
      {children}
    </Component>
  );
};

// Responsive spacing component
interface ResponsiveSpacingProps {
  p?: Partial<Record<Breakpoint | 'base', number>>;
  px?: Partial<Record<Breakpoint | 'base', number>>;
  py?: Partial<Record<Breakpoint | 'base', number>>;
  pt?: Partial<Record<Breakpoint | 'base', number>>;
  pr?: Partial<Record<Breakpoint | 'base', number>>;
  pb?: Partial<Record<Breakpoint | 'base', number>>;
  pl?: Partial<Record<Breakpoint | 'base', number>>;
  m?: Partial<Record<Breakpoint | 'base', number>>;
  mx?: Partial<Record<Breakpoint | 'base', number>>;
  my?: Partial<Record<Breakpoint | 'base', number>>;
  mt?: Partial<Record<Breakpoint | 'base', number>>;
  mr?: Partial<Record<Breakpoint | 'base', number>>;
  mb?: Partial<Record<Breakpoint | 'base', number>>;
  ml?: Partial<Record<Breakpoint | 'base', number>>;
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  children,
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,
  className,
  as: Component = 'div'
}) => {
  const paddingClasses = [];
  const marginClasses = [];
  
  // Padding classes
  if (p) {
    const padding = useResponsiveValue(p);
    paddingClasses.push(`p-${padding}`);
  }
  if (px) {
    const paddingX = useResponsiveValue(px);
    paddingClasses.push(`px-${paddingX}`);
  }
  if (py) {
    const paddingY = useResponsiveValue(py);
    paddingClasses.push(`py-${paddingY}`);
  }
  if (pt) {
    const paddingTop = useResponsiveValue(pt);
    paddingClasses.push(`pt-${paddingTop}`);
  }
  if (pr) {
    const paddingRight = useResponsiveValue(pr);
    paddingClasses.push(`pr-${paddingRight}`);
  }
  if (pb) {
    const paddingBottom = useResponsiveValue(pb);
    paddingClasses.push(`pb-${paddingBottom}`);
  }
  if (pl) {
    const paddingLeft = useResponsiveValue(pl);
    paddingClasses.push(`pl-${paddingLeft}`);
  }
  
  // Margin classes
  if (m) {
    const margin = useResponsiveValue(m);
    marginClasses.push(`m-${margin}`);
  }
  if (mx) {
    const marginX = useResponsiveValue(mx);
    marginClasses.push(`mx-${marginX}`);
  }
  if (my) {
    const marginY = useResponsiveValue(my);
    marginClasses.push(`my-${marginY}`);
  }
  if (mt) {
    const marginTop = useResponsiveValue(mt);
    marginClasses.push(`mt-${marginTop}`);
  }
  if (mr) {
    const marginRight = useResponsiveValue(mr);
    marginClasses.push(`mr-${marginRight}`);
  }
  if (mb) {
    const marginBottom = useResponsiveValue(mb);
    marginClasses.push(`mb-${marginBottom}`);
  }
  if (ml) {
    const marginLeft = useResponsiveValue(ml);
    marginClasses.push(`ml-${marginLeft}`);
  }
  
  return (
    <Component
      className={cn(
        ...paddingClasses,
        ...marginClasses,
        className
      )}
    >
      {children}
    </Component>
  );
};

// Responsive container component
interface ResponsiveContainerProps {
  children: ReactNode;
  maxWidth?: Partial<Record<Breakpoint | 'base', 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none'>>;
  padding?: Partial<Record<Breakpoint | 'base', number>>;
  center?: boolean;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = { base: 'full', lg: '7xl' },
  padding = { base: 4, md: 6, lg: 8 },
  center = true,
  className
}) => {
  const containerMaxWidth = useResponsiveValue(maxWidth);
  const containerPadding = useResponsiveValue(padding);
  
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
    none: 'max-w-none'
  }[containerMaxWidth] || 'max-w-7xl';
  
  return (
    <div
      className={cn(
        'w-full',
        maxWidthClass,
        `px-${containerPadding}`,
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

// Show/Hide components based on breakpoints
interface ShowProps {
  children: ReactNode;
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint[];
}

export const Show: React.FC<ShowProps> = ({ children, above, below, only }) => {
  const { width, currentBreakpoint } = useScreenSize();
  
  let shouldShow = true;
  
  if (above) {
    shouldShow = shouldShow && width >= BREAKPOINTS[above];
  }
  
  if (below) {
    shouldShow = shouldShow && width < BREAKPOINTS[below];
  }
  
  if (only) {
    shouldShow = only.includes(currentBreakpoint);
  }
  
  return shouldShow ? <>{children}</> : null;
};

export const Hide: React.FC<ShowProps> = ({ children, above, below, only }) => {
  const { width, currentBreakpoint } = useScreenSize();
  
  let shouldHide = false;
  
  if (above) {
    shouldHide = shouldHide || width >= BREAKPOINTS[above];
  }
  
  if (below) {
    shouldHide = shouldHide || width < BREAKPOINTS[below];
  }
  
  if (only) {
    shouldHide = only.includes(currentBreakpoint);
  }
  
  return shouldHide ? null : <>{children}</>;
};

// Main ResponsiveWrapper component
interface ResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className
}) => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });
  
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine current breakpoint
  const getCurrentBreakpoint = (width: number): Breakpoint => {
    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'sm'; // Default to smallest breakpoint
  };
  
  const currentBreakpoint = getCurrentBreakpoint(screenSize.width);
  
  // Screen type helpers
  const isMobile = screenSize.width < BREAKPOINTS.md;
  const isTablet = screenSize.width >= BREAKPOINTS.md && screenSize.width < BREAKPOINTS.lg;
  const isDesktop = screenSize.width >= BREAKPOINTS.lg;
  const orientation = screenSize.width > screenSize.height ? 'landscape' : 'portrait';
  
  // Breakpoint helpers
  const isBreakpoint = (breakpoint: Breakpoint): boolean => {
    return currentBreakpoint === breakpoint;
  };
  
  const isMinBreakpoint = (breakpoint: Breakpoint): boolean => {
    return screenSize.width >= BREAKPOINTS[breakpoint];
  };
  
  const isMaxBreakpoint = (breakpoint: Breakpoint): boolean => {
    return screenSize.width < BREAKPOINTS[breakpoint];
  };
  
  const contextValue: ScreenContext = {
    width: screenSize.width,
    height: screenSize.height,
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    isBreakpoint,
    isMinBreakpoint,
    isMaxBreakpoint,
    orientation
  };
  
  return (
    <ScreenSizeContext.Provider value={contextValue}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </ScreenSizeContext.Provider>
  );
};

// Responsive image component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: Partial<Record<Breakpoint | 'base', string>>;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes,
  className,
  objectFit = 'cover'
}) => {
  const { currentBreakpoint } = useScreenSize();
  
  // Use responsive src if provided
  const responsiveSrc = sizes ? (sizes[currentBreakpoint] || sizes.base || src) : src;
  
  const objectFitClass = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];
  
  return (
    <img
      src={responsiveSrc}
      alt={alt}
      className={cn(
        'w-full h-auto',
        objectFitClass,
        className
      )}
    />
  );
};

// Export all components and hooks
export default ResponsiveWrapper;
export {
  BREAKPOINTS,
  type Breakpoint,
  type ScreenContext
};