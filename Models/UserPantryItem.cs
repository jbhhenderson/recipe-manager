namespace RecipeManager.Models;

public class UserPantryItem
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
    public int IngredientId { get; set; }
}