using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace vivansu_2122110118.Model
{
    public class OrderCreateDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public List<OrderDetailCreateDto> OrderDetails { get; set; }
    }
}