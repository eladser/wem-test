using Microsoft.EntityFrameworkCore;
using WemDashboard.Infrastructure.Data;
using WemDashboard.Infrastructure;
using WemDashboard.Application.Mappings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<WemDashboardContext>(options =>
    options.UseNpgsql(connectionString, o => 
    {
        o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
        o.CommandTimeout(30);
    }));

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(SiteProfile));

// Add Infrastructure services
builder.Services.AddInfrastructure();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add health checks
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<WemDashboardContext>();
    context.Database.EnsureCreated();
}

app.Run();
