using System.ComponentModel.DataAnnotations;

namespace RecipeManager.Models;

public class Comment 
{
    public int Id { get; set; }
    [Required]
    public string Body { get; set; }
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; }
    public int UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; }
}