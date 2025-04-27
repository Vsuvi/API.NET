using System.ComponentModel.DataAnnotations;

namespace vivansu_2122110118.Model
{
    public class OrderDetailCreateDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}