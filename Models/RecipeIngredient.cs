using System.ComponentModel.DataAnnotations;

namespace RecipeManager.Models;

public class RecipeIngredient
{
    public int Id { get; set; }
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; }
    public int IngredientNumber { get; set; }
    public Ingredient Ingredient { get; set; }
    public double Amount { get; set; }
    [Required]
    public string MeasurementUnit { get; set; }
}