namespace vivansu_2122110118
{
    public class WeatherForecast
    {
        public int Id { get; set; } // Thêm thu?c tính khóa chính
        public DateOnly Date { get; set; }
        public int TemperatureC { get; set; }
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
        public string? Summary { get; set; }
        public DateTime DateAdded { get; set; }
        public string? AddedBy { get; set; }
        public DateTime? DateModified { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DateDeleted { get; set; }
        public string? DeletedBy { get; set; }
    }
}

