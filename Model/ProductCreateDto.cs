
using Microsoft.AspNetCore.Http;

namespace vivansu_2122110118.Model
{
    public class ProductCreateDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public IFormFile ImageFile { get; set; } // Thay ImageUrl bằng ImageFile
        public int CategoryId { get; set; }
    }
}