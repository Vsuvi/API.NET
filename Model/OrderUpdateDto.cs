using System.ComponentModel.DataAnnotations;

namespace vivansu_2122110118.Model
{
    public class OrderUpdateDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; }
    }
}