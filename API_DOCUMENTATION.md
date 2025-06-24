
# WEM Dashboard API Documentation

## Overview

The Wind Energy Management (WEM) Dashboard API provides comprehensive access to site data, assets, power generation metrics, and analytics. The API is built with a robust gateway layer that handles authentication, rate limiting, caching, and request routing.

## Base URL

```
Production: https://api.wemdashboard.com
Development: http://localhost:3000
```

## Authentication

All API requests require authentication using Bearer tokens:

```
Authorization: Bearer <your-token>
```

## API Gateway Features

- **Rate Limiting**: 1000 requests per hour per endpoint
- **Caching**: Automatic caching for GET requests (5-minute TTL)
- **Request Monitoring**: Comprehensive metrics and logging
- **Failover**: Automatic failover to backup endpoints
- **Mock Data**: Development mode with simulated responses

## Endpoints

### Sites

#### Get Site Data
```http
GET /api/sites/{siteId}
```

**Headers:**
- `X-Include-Assets` (optional): Include asset data (`true`/`false`)
- `X-Include-Power-Data` (optional): Include power generation data (`true`/`false`)
- `X-Include-Metrics` (optional): Include performance metrics (`true`/`false`)
- `X-Time-Range` (optional): Time range for data (`hour`/`day`/`week`/`month`)
- `Accept` (optional): Response format (`application/json`/`text/csv`/`application/xml`)

**Response:**
```json
{
  "site": {
    "id": "site-a",
    "name": "Wind Farm Alpha",
    "location": "Northern California",
    "region": "west-coast",
    "status": "online",
    "totalCapacity": 2500,
    "currentOutput": 1850,
    "efficiency": 92.5,
    "lastUpdate": "2024-01-15T10:30:00Z"
  },
  "assets": [...],
  "powerData": [...],
  "metrics": [...],
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456",
    "totalRecords": 45,
    "format": "json"
  }
}
```

#### Get Site Assets
```http
GET /api/sites/{siteId}/assets
GET /api/sites/{siteId}/assets?type=inverter
```

**Parameters:**
- `type` (optional): Filter by asset type (`inverter`/`battery`/`solar_panel`/`wind_turbine`)

**Response:**
```json
[
  {
    "id": "asset-1",
    "name": "Inverter Unit 1",
    "type": "inverter",
    "siteId": "site-a",
    "status": "online",
    "power": "2.5 MW",
    "efficiency": "94.2%",
    "lastUpdate": "2024-01-15T10:25:00Z"
  }
]
```

#### Get Power Data
```http
GET /api/sites/{siteId}/power-data?range=day
```

**Parameters:**
- `range`: Time range (`hour`/`day`/`week`/`month`)

**Response:**
```json
[
  {
    "time": "2024-01-15T10:00:00Z",
    "solar": 850,
    "battery": 120,
    "grid": 200,
    "wind": 680
  }
]
```

#### Update Site Status
```http
PATCH /api/sites/{siteId}/status
```

**Body:**
```json
{
  "status": "maintenance"
}
```

**Response:**
```json
{
  "id": "site-a",
  "status": "maintenance",
  "lastUpdate": "2024-01-15T10:35:00Z"
}
```

#### Create Site
```http
POST /api/sites
```

**Body:**
```json
{
  "name": "New Wind Farm",
  "location": "Texas",
  "region": "south-central",
  "totalCapacity": 3000
}
```

#### Delete Site
```http
DELETE /api/sites/{siteId}
```

### Analytics

#### Get Site Analytics
```http
GET /api/sites/{siteId}/analytics
GET /api/sites/{siteId}/analytics?metrics=efficiency,output,uptime
```

**Parameters:**
- `metrics` (optional): Comma-separated list of metrics to include

**Response:**
```json
{
  "siteId": "site-a",
  "period": "last_24_hours",
  "efficiency": {
    "current": 92.5,
    "average": 89.2,
    "trend": "up"
  },
  "output": {
    "current": 1850,
    "peak": 2200,
    "average": 1650
  }
}
```

### Data Export

#### Export Site Data
```http
GET /api/sites/{siteId}/export?format=csv
```

**Parameters:**
- `format`: Export format (`json`/`csv`/`pdf`)

**Headers:**
- `Accept`: Corresponding MIME type

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "SITE_NOT_FOUND",
    "message": "Site with ID 'invalid-site' not found",
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

- **Limit**: 1000 requests per hour per endpoint
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Caching

- **GET requests**: Cached for 5 minutes
- **Cache Headers**:
  - `X-Cache-Status`: `HIT`/`MISS`/`STALE`
  - `Cache-Control`: `max-age=300`

## SDKs and Tools

### JavaScript/TypeScript
```javascript
import { siteApiService } from '@/services/siteApiService';

// Get site data with all options
const siteData = await siteApiService.getSiteData('site-a', {
  includeAssets: true,
  includePowerData: true,
  includeMetrics: true,
  timeRange: 'day'
});

// Get specific assets
const inverters = await siteApiService.getSiteAssets('site-a', 'inverter');

// Update site status
await siteApiService.updateSiteStatus('site-a', 'maintenance');
```

### cURL Examples
```bash
# Get site data
curl -H "Authorization: Bearer $TOKEN" \
     -H "X-Include-Assets: true" \
     https://api.wemdashboard.com/api/sites/site-a

# Update site status
curl -X PATCH \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status":"maintenance"}' \
     https://api.wemdashboard.com/api/sites/site-a/status

# Export data as CSV
curl -H "Authorization: Bearer $TOKEN" \
     -H "Accept: text/csv" \
     https://api.wemdashboard.com/api/sites/site-a/export?format=csv
```

## Monitoring and Metrics

The API Gateway provides comprehensive monitoring:

- **Request Metrics**: Duration, status codes, error rates
- **Cache Performance**: Hit rates, memory usage
- **Rate Limiting**: Usage statistics per endpoint
- **Health Checks**: Endpoint availability monitoring

Access monitoring data via the `/api/gateway/metrics` endpoint or use the built-in API Gateway Monitor component.

## Support

For API support or questions:
- Documentation: https://docs.wemdashboard.com
- Support: support@wemdashboard.com
- Status Page: https://status.wemdashboard.com
