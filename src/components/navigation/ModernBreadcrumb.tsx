
import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { ChevronRight, Home, MapPin, Zap } from 'lucide-react';
import { mockRegions } from '@/services/mockDataService';

export const ModernBreadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Dashboard', path: '/', icon: Home }
    ];

    if (pathSegments.length === 0) return breadcrumbs;

    // Handle different route patterns
    if (pathSegments[0] === 'region' && pathSegments[1]) {
      const region = mockRegions.find(r => r.id === pathSegments[1]);
      if (region) {
        breadcrumbs.push({
          label: region.name,
          path: `/region/${region.id}`,
          icon: MapPin
        });
      }
    }

    if (pathSegments[0] === 'site' && pathSegments[1]) {
      const site = mockRegions.flatMap(r => r.sites).find(s => s.id === pathSegments[1]);
      if (site) {
        const region = mockRegions.find(r => r.sites.some(s => s.id === site.id));
        if (region) {
          breadcrumbs.push({
            label: region.name,
            path: `/region/${region.id}`,
            icon: MapPin
          });
        }
        breadcrumbs.push({
          label: site.name,
          path: `/site/${site.id}`,
          icon: Zap
        });

        // Add sub-pages
        if (pathSegments[2]) {
          const subPageLabels: Record<string, string> = {
            grid: 'Grid Management',
            assets: 'Assets',
            reports: 'Reports',
            team: 'Team',
            finances: 'Finances',
            settings: 'Settings'
          };
          
          if (subPageLabels[pathSegments[2]]) {
            breadcrumbs.push({
              label: subPageLabels[pathSegments[2]],
              path: location.pathname,
              icon: undefined
            });
          }
        }
      }
    }

    // Handle other main pages
    const mainPages: Record<string, string> = {
      analytics: 'Analytics',
      assets: 'Assets',
      settings: 'Settings'
    };

    if (pathSegments.length === 1 && mainPages[pathSegments[0]]) {
      breadcrumbs.push({
        label: mainPages[pathSegments[0]],
        path: `/${pathSegments[0]}`,
        icon: undefined
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
          <div className="flex items-center space-x-2">
            {crumb.icon && (
              <crumb.icon className="w-4 h-4 text-slate-400" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-white font-medium">{crumb.label}</span>
            ) : (
              <NavLink
                to={crumb.path}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {crumb.label}
              </NavLink>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};
