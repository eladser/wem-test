import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, MapPin, Building2 } from 'lucide-react';
import { mockRegions } from '@/services/mockDataService';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Overview', href: '/', icon: Home }
    ];

    if (pathSegments.length === 0) {
      items[0].current = true;
      return items;
    }

    // Handle different routes
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const nextSegment = pathSegments[i + 1];

      switch (segment) {
        case 'analytics':
          items.push({ label: 'Analytics', current: true });
          break;
        case 'assets':
          items.push({ label: 'Assets', current: true });
          break;
        case 'settings':
          items.push({ label: 'Settings', current: true });
          break;
        case 'region':
          if (nextSegment) {
            const region = mockRegions.find(r => r.id === nextSegment);
            items.push({
              label: region?.name || 'Unknown Region',
              href: `/region/${nextSegment}`,
              icon: MapPin,
              current: i === pathSegments.length - 2
            });
          }
          break;
        case 'site':
          if (nextSegment) {
            const site = mockRegions
              .flatMap(r => r.sites)
              .find(s => s.id === nextSegment);
            
            if (site) {
              // Add region breadcrumb first
              const region = mockRegions.find(r => r.sites.some(s => s.id === nextSegment));
              if (region) {
                items.push({
                  label: region.name,
                  href: `/region/${region.id}`,
                  icon: MapPin
                });
              }
              
              // Add site breadcrumb
              const siteSegmentIndex = i + 1;
              const subPage = pathSegments[siteSegmentIndex + 1];
              
              items.push({
                label: site.name,
                href: `/site/${nextSegment}`,
                icon: Building2,
                current: !subPage
              });
              
              // Add sub-page if exists
              if (subPage) {
                const subPageLabels: { [key: string]: string } = {
                  'grid': 'Grid Management',
                  'assets': 'Assets',
                  'reports': 'Reports',
                  'finances': 'Finances',
                  'team': 'Team',
                  'settings': 'Settings'
                };
                
                items.push({
                  label: subPageLabels[subPage] || subPage,
                  current: true
                });
              }
            }
          }
          break;
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700/50">
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-500 mx-2 flex-shrink-0" />
            )}
            
            {item.current ? (
              <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="truncate max-w-32">{item.label}</span>
              </div>
            ) : (
              <Link
                to={item.href!}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors group"
              >
                {item.icon && <item.icon className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />}
                <span className="truncate max-w-32 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
