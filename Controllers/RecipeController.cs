using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeManager.Data;

namespace RecipeManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private RecipeManagerDbContext _dbContext;

    public RecipeController(RecipeManagerDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext.Recipes.OrderByDescending(r => r.DateCreated));
    }

    [HttpGet("my-recipes/{userId}")]
    [Authorize]
    public IActionResult GetMyRecipes(int userId)
    {
        return Ok(_dbContext
            .Recipes
            .Where(r => r.UserProfileId == userId)
            .OrderByDescending(r => r.DateCreated));
    }
}