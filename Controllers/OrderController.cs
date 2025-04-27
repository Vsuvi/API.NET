using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vivansu_2122110118.Data;
using vivansu_2122110118.Model;

namespace vivansu_2122110118.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /Order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrders()
        {
            var orders = await _context.Orders
                .Where(o => o.DeletedDate == null)
                .Include(o => o.User)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    User = new UserResponseDto
                    {
                        Id = o.User.Id,
                        Username = o.User.Username,
                        Email = o.User.Email,
                        FullName = o.User.FullName,
                        Role = o.User.Role
                    },
                    OrderDetails = o.OrderDetails.Select(od => new OrderDetailResponseDto
                    {
                        Id = od.Id,
                        ProductId = od.ProductId,
                        Quantity = od.Quantity,
                        UnitPrice = od.UnitPrice,
                        Product = new ProductResponseDto
                        {
                            Id = od.Product.Id,
                            Name = od.Product.Name,
                            Price = od.Product.Price,
                            Description = od.Product.Description,
                            Image = od.Product.Image,
                            CategoryId = od.Product.CategoryId
                        },
                        CreatedDate = od.CreatedDate,
                        CreatedBy = od.CreatedBy,
                        UpdatedDate = od.UpdatedDate,
                        UpdatedBy = od.UpdatedBy
                    }).ToList(),
                    CreatedDate = o.CreatedDate,
                    CreatedBy = o.CreatedBy,
                    UpdatedDate = o.UpdatedDate,
                    UpdatedBy = o.UpdatedBy
                })
                .ToListAsync();

            return orders;
        }

        // GET: /Order/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.DeletedDate == null);

            if (order == null)
            {
                return NotFound();
            }

            var orderDto = new OrderResponseDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                User = new UserResponseDto
                {
                    Id = order.User.Id,
                    Username = order.User.Username,
                    Email = order.User.Email,
                    FullName = order.User.FullName,
                    Role = order.User.Role
                },
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailResponseDto
                {
                    Id = od.Id,
                    ProductId = od.ProductId,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    Product = new ProductResponseDto
                    {
                        Id = od.Product.Id,
                        Name = od.Product.Name,
                        Price = od.Product.Price,
                        Description = od.Product.Description,
                        Image = od.Product.Image,
                        CategoryId = od.Product.CategoryId
                    },
                    CreatedDate = od.CreatedDate,
                    CreatedBy = od.CreatedBy,
                    UpdatedDate = od.UpdatedDate,
                    UpdatedBy = od.UpdatedBy
                }).ToList(),
                CreatedDate = order.CreatedDate,
                CreatedBy = order.CreatedBy,
                UpdatedDate = order.UpdatedDate,
                UpdatedBy = order.UpdatedBy
            };

            return orderDto;
        }

        // POST: /Order
        [HttpPost]
        public async Task<ActionResult<OrderResponseDto>> PostOrder(OrderCreateDto orderDto)
        {
            // Log input để debug
            Console.WriteLine($"Received userId: {orderDto.UserId}");
            Console.WriteLine($"Received orderDetails: {System.Text.Json.JsonSerializer.Serialize(orderDto.OrderDetails)}");

            // Kiểm tra User tồn tại
            var user = await _context.Users.FindAsync(orderDto.UserId);
            if (user == null || user.DeletedDate != null)
            {
                return BadRequest("Invalid UserId.");
            }

            // Kiểm tra OrderDetails
            if (orderDto.OrderDetails == null || !orderDto.OrderDetails.Any())
            {
                return BadRequest("Order must have at least one OrderDetail.");
            }

            // Sử dụng transaction để đảm bảo tính toàn vẹn
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Tạo Order
                var order = new Order
                {
                    UserId = orderDto.UserId,
                    OrderDate = DateTime.Now,
                    Status = "Pending",
                    CreatedDate = DateTime.Now,
                    CreatedBy = "System"
                };

                // Tạo OrderDetails và tính TotalAmount
                decimal totalAmount = 0;
                var orderDetails = new List<OrderDetail>();
                foreach (var detailDto in orderDto.OrderDetails)
                {
                    // Kiểm tra Product tồn tại
                    var product = await _context.Products.FindAsync(detailDto.ProductId);
                    if (product == null || product.DeletedDate != null)
                    {
                        return BadRequest($"Invalid ProductId: {detailDto.ProductId}.");
                    }

                    var detail = new OrderDetail
                    {
                        ProductId = detailDto.ProductId,
                        Quantity = detailDto.Quantity,
                        UnitPrice = product.Price,
                        CreatedDate = DateTime.Now,
                        CreatedBy = "System"
                    };

                    orderDetails.Add(detail);
                    totalAmount += detail.Quantity * detail.UnitPrice;

                    // Log để debug
                    Console.WriteLine($"Added OrderDetail: ProductId={detail.ProductId}, Quantity={detail.Quantity}");
                }

                order.OrderDetails = orderDetails;
                order.TotalAmount = totalAmount;

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Commit transaction
                await transaction.CommitAsync();

                // Load lại Order để trả về DTO
                var createdOrder = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == order.Id);

                var orderResponse = new OrderResponseDto
                {
                    Id = createdOrder.Id,
                    UserId = createdOrder.UserId,
                    OrderDate = createdOrder.OrderDate,
                    TotalAmount = createdOrder.TotalAmount,
                    Status = createdOrder.Status,
                    User = new UserResponseDto
                    {
                        Id = createdOrder.User.Id,
                        Username = createdOrder.User.Username,
                        Email = createdOrder.User.Email,
                        FullName = createdOrder.User.FullName,
                        Role = createdOrder.User.Role
                    },
                    OrderDetails = createdOrder.OrderDetails.Select(od => new OrderDetailResponseDto
                    {
                        Id = od.Id,
                        ProductId = od.ProductId,
                        Quantity = od.Quantity,
                        UnitPrice = od.UnitPrice,
                        Product = new ProductResponseDto
                        {
                            Id = od.Product.Id,
                            Name = od.Product.Name,
                            Price = od.Product.Price,
                            Description = od.Product.Description,
                            Image = od.Product.Image,
                            CategoryId = od.Product.CategoryId
                        },
                        CreatedDate = od.CreatedDate,
                        CreatedBy = od.CreatedBy,
                        UpdatedDate = od.UpdatedDate,
                        UpdatedBy = od.UpdatedBy
                    }).ToList(),
                    CreatedDate = createdOrder.CreatedDate,
                    CreatedBy = createdOrder.CreatedBy,
                    UpdatedDate = createdOrder.UpdatedDate,
                    UpdatedBy = createdOrder.UpdatedBy
                };

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderResponse);
            }
            catch (Exception ex)
            {
                // Rollback transaction nếu lỗi
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: /Order/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderUpdateDto orderDto)
        {
            if (id != orderDto.Id)
            {
                return BadRequest();
            }

            var order = await _context.Orders.FindAsync(id);
            if (order == null || order.DeletedDate != null)
            {
                return NotFound();
            }

            order.Status = orderDto.Status;
            order.UpdatedDate = DateTime.Now;
            order.UpdatedBy = "System";

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: /Order/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null || order.DeletedDate != null)
            {
                return NotFound();
            }

            order.DeletedDate = DateTime.Now;
            order.DeletedBy = "System";

            foreach (var detail in order.OrderDetails)
            {
                detail.DeletedDate = DateTime.Now;
                detail.DeletedBy = "System";
            }

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: /Order/ByUser/5
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrdersByUser(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId && o.DeletedDate == null)
                .Include(o => o.User)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    User = new UserResponseDto
                    {
                        Id = o.User.Id,
                        Username = o.User.Username,
                        Email = o.User.Email,
                        FullName = o.User.FullName,
                        Role = o.User.Role
                    },
                    OrderDetails = o.OrderDetails.Select(od => new OrderDetailResponseDto
                    {
                        Id = od.Id,
                        ProductId = od.ProductId,
                        Quantity = od.Quantity,
                        UnitPrice = od.UnitPrice,
                        Product = new ProductResponseDto
                        {
                            Id = od.Product.Id,
                            Name = od.Product.Name,
                            Price = od.Product.Price,
                            Description = od.Product.Description,
                            Image = od.Product.Image,
                            CategoryId = od.Product.CategoryId
                        },
                        CreatedDate = od.CreatedDate,
                        CreatedBy = od.CreatedBy,
                        UpdatedDate = od.UpdatedDate,
                        UpdatedBy = od.UpdatedBy
                    }).ToList(),
                    CreatedDate = o.CreatedDate,
                    CreatedBy = o.CreatedBy,
                    UpdatedDate = o.UpdatedDate,
                    UpdatedBy = o.UpdatedBy
                })
                .ToListAsync();

            return orders;
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id && e.DeletedDate == null);
        }
    }
}