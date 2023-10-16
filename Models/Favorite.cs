namespace RecipeManager.Models;

public class Favorite
{
    public int Id { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; }
}