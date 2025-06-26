# Database Deployment Guide

## 🚀 Database Deployment Options for GitHub Integration

This guide covers various ways to deploy your WEM Dashboard backend with different database options that work well with GitHub workflows.

## 📋 Quick Options Summary

| Option | Cost | Complexity | GitHub Integration | Production Ready |
|--------|------|------------|-------------------|------------------|
| **SQLite** | Free | Low | ✅ Excellent | 🔶 Small apps only |
| **Supabase** | Free tier | Low | ✅ Excellent | ✅ Yes |
| **PlanetScale** | Free tier | Medium | ✅ Excellent | ✅ Yes |
| **Railway** | Free tier | Low | ✅ Excellent | ✅ Yes |
| **Render** | Free tier | Low | ✅ Good | ✅ Yes |
| **Azure SQL** | Pay-per-use | Medium | ✅ Good | ✅ Yes |

## 🎯 Recommended: Supabase (PostgreSQL)

**Why Supabase?**
- Free tier with 500MB database
- PostgreSQL (production-grade)
- Built-in authentication (optional)
- Real-time subscriptions
- Excellent GitHub integration
- Auto-generated API documentation

### Setup Steps:

1. **Create Supabase Project:**
   ```bash
   # Go to https://supabase.com
   # Click "New Project"
   # Choose organization and create project
   ```

2. **Get Connection String:**
   ```bash
   # In Supabase Dashboard → Settings → Database
   # Copy the connection string
   ```

3. **Update appsettings.json:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=db.your-project.supabase.co;Database=postgres;Username=postgres;Password=your-password;Port=5432;SSL Mode=Require;"
     },
     "DatabaseProvider": "PostgreSQL"
   }
   ```

4. **Deploy to Render/Railway:**
   ```yaml
   # render.yaml
   services:
     - type: web
       name: wemdashboard-api
       env: dotnet
       buildCommand: dotnet build --configuration Release
       startCommand: dotnet WemDashboard.API.dll
       envVars:
         - key: ConnectionStrings__DefaultConnection
           fromDatabase:
             name: your-database
             property: connectionString
         - key: DatabaseProvider
           value: PostgreSQL
   ```

## 🛤️ Railway (Recommended for Simplicity)

**Perfect for GitHub integration with minimal setup:**

1. **Connect GitHub Repository:**
   ```bash
   # Go to https://railway.app
   # Click "Deploy from GitHub"
   # Select your repository
   ```

2. **Add PostgreSQL Database:**
   ```bash
   # In Railway dashboard
   # Click "+ New" → "Database" → "PostgreSQL"
   ```

3. **Set Environment Variables:**
   ```bash
   DATABASE_URL=postgresql://username:password@host:port/dbname
   DatabaseProvider=PostgreSQL
   ASPNETCORE_ENVIRONMENT=Production
   ```

4. **Auto-deploy on Push:**
   - Railway automatically deploys when you push to main branch
   - Migrations run automatically on startup
   - Zero-downtime deployments

## 🐳 Docker + GitHub Actions + Cloud SQL

**For more control and scalability:**

### 1. Create GitHub Actions Workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: true
        tags: |
          ghcr.io/${{ github.repository }}/wemdashboard-api:latest
          ghcr.io/${{ github.repository }}/wemdashboard-api:${{ github.sha }}
    
    - name: Deploy to Cloud Run
      uses: google-github-actions/deploy-cloudrun@v1
      with:
        service: wemdashboard-api
        image: ghcr.io/${{ github.repository }}/wemdashboard-api:latest
        env_vars: |
          ConnectionStrings__DefaultConnection=${{ secrets.DATABASE_CONNECTION_STRING }}
          DatabaseProvider=PostgreSQL
          ASPNETCORE_ENVIRONMENT=Production
```

### 2. Set GitHub Secrets:

```bash
# In GitHub repository → Settings → Secrets
DATABASE_CONNECTION_STRING=your-connection-string
JWT_SECRET_KEY=your-jwt-secret-key
```

## 💾 SQLite for Development & Small Production

**Simplest option - database file in your repository:**

### Pros:
- Zero setup
- Perfect for development
- Can be committed to Git (small databases)
- Serverless

### Cons:
- Not suitable for high traffic
- Single writer limitation
- Scaling limitations

### Setup:

1. **Update appsettings.json:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=wemdashboard.db"
     },
     "DatabaseProvider": "SQLite"
   }
   ```

2. **Deploy to any static host:**
   ```bash
   # Publish as self-contained
   dotnet publish -c Release -r linux-x64 --self-contained
   
   # Deploy to:
   # - GitHub Pages (static)
   # - Netlify Functions
   # - Vercel
   # - Any VPS
   ```

## 🔄 Database Migrations in CI/CD

### Automatic Migrations (Current Setup):
```csharp
// In Program.cs - runs on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<WemDashboardDbContext>();
    await context.Database.EnsureCreatedAsync();
    await seeder.SeedAsync();
}
```

### Manual Migrations (Production):
```bash
# Create migration
dotnet ef migrations add InitialCreate --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API

# Update database
dotnet ef database update --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API
```

### GitHub Actions Migration:
```yaml
- name: Run Database Migrations
  run: |
    dotnet ef database update --project src/WemDashboard.Infrastructure --startup-project src/WemDashboard.API
  env:
    ConnectionStrings__DefaultConnection: ${{ secrets.DATABASE_CONNECTION_STRING }}
```

## 🔐 Environment Variables for Different Providers

### Supabase:
```bash
ConnectionStrings__DefaultConnection="Host=db.xxx.supabase.co;Database=postgres;Username=postgres;Password=xxx;Port=5432;SSL Mode=Require;"
DatabaseProvider=PostgreSQL
```

### PlanetScale:
```bash
ConnectionStrings__DefaultConnection="Server=xxx.planetscale.com;Database=wemdashboard;Uid=xxx;Pwd=xxx;SslMode=Required;"
DatabaseProvider=MySQL
```

### Azure SQL:
```bash
ConnectionStrings__DefaultConnection="Server=tcp:xxx.database.windows.net,1433;Database=wemdashboard;User ID=xxx;Password=xxx;Encrypt=True;Connection Timeout=30;"
DatabaseProvider=SqlServer
```

### Railway PostgreSQL:
```bash
ConnectionStrings__DefaultConnection="postgresql://xxx:xxx@xxx.railway.app:5432/railway"
DatabaseProvider=PostgreSQL
```

## 📊 Performance Considerations

### SQLite:
- **Best for:** < 1GB data, < 100 concurrent users
- **Limitations:** Single writer, no horizontal scaling

### PostgreSQL (Supabase/Railway):
- **Best for:** Most applications, excellent performance
- **Scaling:** Vertical scaling, read replicas available

### MySQL (PlanetScale):
- **Best for:** High-scale applications
- **Features:** Branching, schema migrations, global distribution

## 🚀 Deployment Commands

### One-Click Deploy to Railway:
```bash
# Fork repository → Connect to Railway → Deploy
# Railway automatically detects .NET and builds
```

### Deploy to Render:
```bash
# Connect GitHub → Create Web Service
# Build: dotnet build --configuration Release
# Start: dotnet WemDashboard.API.dll
```

### Deploy to Azure:
```bash
az webapp up --runtime "DOTNETCORE|8.0" --name wemdashboard-api
```

## 💡 Pro Tips

1. **Start with Railway or Render** for simplicity
2. **Use Supabase** for the database (free PostgreSQL)
3. **Set up GitHub Actions** for automatic deployments
4. **Use environment variables** for all configuration
5. **Enable logging** to debug issues
6. **Set up health checks** for monitoring

## 📚 Next Steps

1. Choose your deployment option
2. Set up the database
3. Configure environment variables
4. Deploy your application
5. Update your frontend to use the production API URL
6. Set up monitoring and logging

**Need help?** The backend includes comprehensive logging and error handling to help debug any deployment issues!
