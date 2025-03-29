using Microsoft.EntityFrameworkCore;

namespace vivansu_2122110118.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<vivansu_2122110118.Model.Product> Products { get; set; }
    }
}