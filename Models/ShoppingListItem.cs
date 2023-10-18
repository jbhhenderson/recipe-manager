namespace RecipeManager.Models;

public class ShoppingListItem
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
    public int IngredientNumber { get; set; }
    public Ingredient Ingredient { get; set; }
}