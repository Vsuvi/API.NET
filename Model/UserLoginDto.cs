using System.ComponentModel.DataAnnotations;

namespace vivansu_2122110118.Model
{
    public class UserLoginDto
    {
        [Required]
        [StringLength(100)]
        public string UsernameOrEmail { get; set; }

        [Required]
        [StringLength(100)]
        public string Password { get; set; }
    }
}