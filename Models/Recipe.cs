using System.ComponentModel.DataAnnotations;

namespace RecipeManager.Models;

public class Recipe
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
    public DateTime DateCreated { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string Instructions { get; set; }
    public string Image { get; set; }
    public List<RecipeIngredient> RecipeIngredients { get; set; }
}