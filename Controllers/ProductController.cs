
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vivansu_2122110118.Data;
using vivansu_2122110118.Model;
using System.IO;

namespace vivansu_2122110118.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProductController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: /Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts()
        {
            try
            {
                var products = await _context.Products
                    .Where(p => p.DeletedDate == null)
                    .Select(p => new ProductResponseDto
                    {
                        Id = p.Id,
                        Name = p.Name ?? "",
                        Price = p.Price,
                        Description = p.Description,
                        Image = p.Image,
                        CategoryId = p.CategoryId
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy danh sách sản phẩm: {ex.Message}");
            }
        }

        // GET: /Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Where(p => p.DeletedDate == null && p.Id == id)
                    .Select(p => new ProductResponseDto
                    {
                        Id = p.Id,
                        Name = p.Name ?? "",
                        Price = p.Price,
                        Description = p.Description,
                        Image = p.Image,
                        CategoryId = p.CategoryId
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound("Sản phẩm không tồn tại hoặc đã bị xóa.");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy sản phẩm: {ex.Message}");
            }
        }

        // POST: /Product
        [HttpPost]
        public async Task<ActionResult<ProductResponseDto>> PostProduct([FromForm] ProductCreateDto productDto)
        {
            if (string.IsNullOrEmpty(productDto.Name))
            {
                return BadRequest("Tên sản phẩm là bắt buộc.");
            }

            string imagePath = null;
            if (productDto.ImageFile != null && productDto.ImageFile.Length > 0)
            {
                var extension = Path.GetExtension(productDto.ImageFile.FileName).ToLower();
                if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
                {
                    return BadRequest("Chỉ hỗ trợ tệp JPG hoặc PNG.");
                }

                if (productDto.ImageFile.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("Tệp hình ảnh không được vượt quá 5MB.");
                }

                try
                {
                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "images");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = Guid.NewGuid().ToString() + extension;
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productDto.ImageFile.CopyToAsync(stream);
                    }

                    imagePath = $"/images/{fileName}";
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Lỗi khi lưu ảnh: {ex.Message}");
                }
            }

            try
            {
                var product = new Product
                {
                    Name = productDto.Name,
                    Price = productDto.Price,
                    Description = productDto.Description,
                    Image = imagePath,
                    CategoryId = productDto.CategoryId,
                    CreatedDate = DateTime.Now,
                    CreatedBy = "System"
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var responseDto = new ProductResponseDto
                {
                    Id = product.Id,
                    Name = product.Name ?? "",
                    Price = product.Price,
                    Description = product.Description,
                    Image = product.Image,
                    CategoryId = product.CategoryId
                };

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi thêm sản phẩm: {ex.Message}");
            }
        }

        // PUT: /Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, [FromForm] ProductUpdateDto productDto)
        {
            if (id != productDto.Id)
            {
                return BadRequest("ID không khớp.");
            }

            if (string.IsNullOrEmpty(productDto.Name))
            {
                return BadRequest("Tên sản phẩm là bắt buộc.");
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null || product.DeletedDate != null)
            {
                return NotFound("Sản phẩm không tồn tại hoặc đã bị xóa.");
            }

            string imagePath = product.Image;
            if (productDto.ImageFile != null && productDto.ImageFile.Length > 0)
            {
                var extension = Path.GetExtension(productDto.ImageFile.FileName).ToLower();
                if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
                {
                    return BadRequest("Chỉ hỗ trợ tệp JPG hoặc PNG.");
                }

                if (productDto.ImageFile.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("Tệp hình ảnh không được vượt quá 5MB.");
                }

                try
                {
                    var uploadsFolder = Path.Combine(_environment.WebRootPath, "images");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = Guid.NewGuid().ToString() + extension;
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productDto.ImageFile.CopyToAsync(stream);
                    }

                    imagePath = $"/images/{fileName}";

                    // Xóa ảnh cũ (nếu có)
                    if (!string.IsNullOrEmpty(product.Image))
                    {
                        var oldImagePath = Path.Combine(_environment.WebRootPath, product.Image.TrimStart('/'));
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Lỗi khi lưu ảnh: {ex.Message}");
                }
            }

            try
            {
                product.Name = productDto.Name;
                product.Price = productDto.Price;
                product.Description = productDto.Description;
                product.Image = imagePath;
                product.CategoryId = productDto.CategoryId;
                product.UpdatedDate = DateTime.Now;
                product.UpdatedBy = "System";

                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi cập nhật sản phẩm: {ex.Message}");
            }
        }

        // DELETE: /Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null || product.DeletedDate != null)
                {
                    return NotFound("Sản phẩm không tồn tại hoặc đã bị xóa.");
                }

                // Xóa ảnh (nếu có)
                if (!string.IsNullOrEmpty(product.Image))
                {
                    var imagePath = Path.Combine(_environment.WebRootPath, product.Image.TrimStart('/'));
                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                }

                product.DeletedDate = DateTime.Now;
                product.DeletedBy = "System";

                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi xóa sản phẩm: {ex.Message}");
            }
        }

        // GET: /Product/by-category/{categoryId}
        [HttpGet("by-category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProductsByCategory(int categoryId)
        {
            try
            {
                var products = await _context.Products
                    .Where(p => p.CategoryId == categoryId && p.DeletedDate == null)
                    .Select(p => new ProductResponseDto
                    {
                        Id = p.Id,
                        Name = p.Name ?? "",
                        Price = p.Price,
                        Description = p.Description,
                        Image = p.Image,
                        CategoryId = p.CategoryId
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi lấy sản phẩm theo danh mục: {ex.Message}");
            }
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id && e.DeletedDate == null);
        }
    }
}