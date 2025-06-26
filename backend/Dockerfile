# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy solution file and project files
COPY *.sln ./
COPY src/WemDashboard.API/*.csproj ./src/WemDashboard.API/
COPY src/WemDashboard.Application/*.csproj ./src/WemDashboard.Application/
COPY src/WemDashboard.Domain/*.csproj ./src/WemDashboard.Domain/
COPY src/WemDashboard.Infrastructure/*.csproj ./src/WemDashboard.Infrastructure/
COPY src/WemDashboard.Shared/*.csproj ./src/WemDashboard.Shared/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Build the application
WORKDIR /app/src/WemDashboard.API
RUN dotnet build -c Release -o /app/build

# Publish the application
RUN dotnet publish -c Release -o /app/publish --no-restore

# Use the official ASP.NET Core runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the published application
COPY --from=build /app/publish .

# Create a non-root user
RUN adduser --disabled-password --gecos '' dotnetuser && chown -R dotnetuser /app
USER dotnetuser

# Expose ports
EXPOSE 80
EXPOSE 443

# Set the entry point
ENTRYPOINT ["dotnet", "WemDashboard.API.dll"]
