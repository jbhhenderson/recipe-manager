namespace RecipeManager.Models;

public class UserPantryItem
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
    public int IngredientNumber { get; set; }
    public Ingredient Ingredient { get; set; }
}