using System.ComponentModel.DataAnnotations;

namespace vivansu_2122110118.Model
{
    public class UserUpdateDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(100)]
        public string? FullName { get; set; }

        [Required]
        [StringLength(20)]
        public string Role { get; set; }
    }
}