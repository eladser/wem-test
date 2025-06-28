export interface UserPreferences {
  id: number;
  userId: string;
  
  // Theme and Display Settings
  theme: string;
  language: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  autoRefresh: boolean;
  refreshInterval: number;
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  criticalAlertsOnly: boolean;
  notificationSound: string;
  
  // Dashboard Layout
  defaultDashboard: string;
  showSidebar: boolean;
  compactMode: boolean;
  
  // Data Display Preferences
  powerUnit: string;
  energyUnit: string;
  currencySymbol: string;
  decimalPlaces: number;
  
  // Chart and Analytics Settings
  defaultChartType: string;
  chartAnimationDuration: number;
  showDataLabels: boolean;
  chartColorScheme: string;
  
  // Security Settings
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  requirePasswordChange: boolean;
  passwordChangeInterval: number;
  
  // Export Settings
  defaultExportFormat: string;
  includeHeaders: boolean;
  dateRangeDefault: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLayout {
  id: number;
  userId: string;
  layoutName: string;
  pageName: string;
  isDefault: boolean;
  layoutConfig: string;
  gridColumns: number;
  gridRows: number;
  gridGap: string;
  widgetPositions: string;
  createdAt: string;
  updatedAt: string;
}

export interface WidgetConfiguration {
  id: number;
  userId: string;
  widgetId: string;
  widgetType: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  settings: string;
  dataSource: string;
  dataFilters: string;
  isVisible: boolean;
  isResizable: boolean;
  isDraggable: boolean;
  pageName: string;
  dashboardLayoutId: number;
  createdAt: string;
  updatedAt: string;
}

export interface GridComponentConfiguration {
  id: number;
  userId: string;
  componentId: string;
  componentType: string;
  name: string;
  x: number;
  y: number;
  power: number;
  status: string;
  efficiency?: number;
  capacity?: number;
  additionalSettings: string;
  siteId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnergyFlowConfiguration {
  id: number;
  userId: string;
  flowId: string;
  fromComponentId: string;
  toComponentId: string;
  power: number;
  enabled: boolean;
  color: string;
  lineStyle: string;
  lineWidth: number;
  siteId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GridConfiguration {
  components: GridComponentConfiguration[];
  flows: EnergyFlowConfiguration[];
  userId: string;
  siteId?: number;
}

export interface FilterPreset {
  id: number;
  userId: string;
  name: string;
  description: string;
  pageName: string;
  filterConfig: string;
  isDefault: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: number;
  userId: string;
  name: string;
  description: string;
  reportType: string;
  templateConfig: string;
  isScheduled: boolean;
  scheduleCron: string;
  recipients: string;
  exportFormat: string;
  includeCharts: boolean;
  includeData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ViewState<T = any> {
  value: T;
  expiresAt?: string;
  isPersistent?: boolean;
}

// Helper types for frontend usage
export interface ParsedLayoutConfig {
  [key: string]: any;
}

export interface ParsedWidgetSettings {
  [key: string]: any;
}

export interface ParsedFilterConfig {
  [key: string]: any;
}

export interface ParsedTemplateConfig {
  [key: string]: any;
}