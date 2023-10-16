namespace RecipeManager.Models;

public class ShoppingListItem
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
    public int IngredientId { get; set; }
}