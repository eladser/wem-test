namespace WemDashboard.Shared.Constants;

public static class AppConstants
{
    public const string ApiVersion = "v1";
    public const string ApiTitle = "WEM Dashboard API";
    public const string ApiDescription = "Wind Energy Management Dashboard API";
    
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Manager = "Manager";
        public const string Operator = "Operator";
        public const string Viewer = "Viewer";
    }
    
    public static class Policies
    {
        public const string AdminOnly = "AdminOnly";
        public const string ManagerOrAbove = "ManagerOrAbove";
        public const string OperatorOrAbove = "OperatorOrAbove";
        public const string AllRoles = "AllRoles";
    }
    
    public static class CacheKeys
    {
        public const string Sites = "sites";
        public const string SiteById = "site_{0}";
        public const string Assets = "assets";
        public const string AssetsBySite = "assets_site_{0}";
        public const string PowerData = "power_data_{0}";
        public const string Metrics = "metrics_{0}";
        public const string Analytics = "analytics_{0}";
    }
    
    public static class DefaultValues
    {
        public const int DefaultPageSize = 10;
        public const int MaxPageSize = 100;
        public const int CacheExpirationMinutes = 5;
        public const int JwtExpirationMinutes = 60;
        public const int RefreshTokenExpirationDays = 7;
    }
    
    public static class Headers
    {
        public const string IncludeAssets = "X-Include-Assets";
        public const string IncludePowerData = "X-Include-Power-Data";
        public const string IncludeMetrics = "X-Include-Metrics";
        public const string TimeRange = "X-Time-Range";
        public const string CacheStatus = "X-Cache-Status";
        public const string RequestId = "X-Request-Id";
    }
}
