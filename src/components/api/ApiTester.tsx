
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Send, Download } from 'lucide-react';
import { siteApiService } from '@/services/siteApiService';
import { toast } from 'sonner';

export const ApiTester: React.FC = () => {
  const [endpoint, setEndpoint] = useState('/api/sites/site-a');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState('site-a');

  const handleApiCall = async () => {
    setIsLoading(true);
    try {
      let result;
      
      switch (endpoint) {
        case '/api/sites/{siteId}':
          result = await siteApiService.getSiteData(selectedSiteId, {
            includeAssets: true,
            includePowerData: true,
            includeMetrics: true
          });
          break;
        case '/api/sites/{siteId}/assets':
          result = await siteApiService.getSiteAssets(selectedSiteId);
          break;
        case '/api/sites/{siteId}/power-data':
          result = await siteApiService.getSitePowerData(selectedSiteId);
          break;
        case '/api/sites/{siteId}/analytics':
          result = await siteApiService.getSiteAnalytics(selectedSiteId, ['efficiency', 'output']);
          break;
        default:
          result = { message: 'Mock response for ' + endpoint, timestamp: new Date().toISOString() };
      }

      setResponse(JSON.stringify(result, null, 2));
      toast.success('API call successful');
    } catch (error) {
      setResponse(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }, null, 2));
      toast.error('API call failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadPostmanCollection = () => {
    const collection = {
      info: {
        name: "WEM Dashboard API",
        description: "API collection for Wind Energy Management Dashboard",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      auth: {
        type: "bearer",
        bearer: [{ key: "token", value: "{{auth_token}}", type: "string" }]
      },
      variable: [
        { key: "base_url", value: "http://localhost:3000", type: "string" },
        { key: "site_id", value: "site-a", type: "string" }
      ],
      item: [
        {
          name: "Get Site Data",
          request: {
            method: "GET",
            header: [
              { key: "Accept", value: "application/json" },
              { key: "X-Include-Assets", value: "true" },
              { key: "X-Include-Power-Data", value: "true" }
            ],
            url: {
              raw: "{{base_url}}/api/sites/{{site_id}}",
              host: ["{{base_url}}"],
              path: ["api", "sites", "{{site_id}}"]
            }
          }
        },
        {
          name: "Get Site Assets",
          request: {
            method: "GET",
            url: {
              raw: "{{base_url}}/api/sites/{{site_id}}/assets",
              host: ["{{base_url}}"],
              path: ["api", "sites", "{{site_id}}", "assets"]
            }
          }
        },
        {
          name: "Get Power Data",
          request: {
            method: "GET",
            url: {
              raw: "{{base_url}}/api/sites/{{site_id}}/power-data?range=day",
              host: ["{{base_url}}"],
              path: ["api", "sites", "{{site_id}}", "power-data"],
              query: [{ key: "range", value: "day" }]
            }
          }
        },
        {
          name: "Update Site Status",
          request: {
            method: "PATCH",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ status: "maintenance" })
            },
            url: {
              raw: "{{base_url}}/api/sites/{{site_id}}/status",
              host: ["{{base_url}}"],
              path: ["api", "sites", "{{site_id}}", "status"]
            }
          }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'WEM-Dashboard-API.postman_collection.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Postman collection downloaded');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            API Tester
            <Button onClick={downloadPostmanCollection} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Postman Collection
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="request" className="w-full">
            <TabsList>
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={endpoint} onValueChange={setEndpoint}>
                  <SelectTrigger className="md:col-span-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/api/sites/{siteId}">Get Site Data</SelectItem>
                    <SelectItem value="/api/sites/{siteId}/assets">Get Site Assets</SelectItem>
                    <SelectItem value="/api/sites/{siteId}/power-data">Get Power Data</SelectItem>
                    <SelectItem value="/api/sites/{siteId}/analytics">Get Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Site ID"
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
              />

              {['POST', 'PATCH'].includes(method) && (
                <Textarea
                  placeholder="Request body (JSON)"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={4}
                />
              )}

              <Button onClick={handleApiCall} disabled={isLoading} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send Request'}
              </Button>
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="outline">Response</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(response)}
                  disabled={!response}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={response}
                readOnly
                rows={15}
                className="font-mono text-sm"
                placeholder="Response will appear here..."
              />
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Get Site Data with Options</h4>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    GET /api/sites/site-a<br/>
                    Headers:<br/>
                    X-Include-Assets: true<br/>
                    X-Include-Power-Data: true<br/>
                    X-Time-Range: day
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Update Site Status</h4>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    PATCH /api/sites/site-a/status<br/>
                    Body: {JSON.stringify({ status: "maintenance" }, null, 2)}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Export Site Data</h4>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    GET /api/sites/site-a/export?format=csv<br/>
                    Accept: text/csv
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
