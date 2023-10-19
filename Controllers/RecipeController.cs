using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeManager.Data;
using RecipeManager.Models;

namespace RecipeManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private RecipeManagerDbContext _dbContext;
    private SpoonacularAPIService _ingredientService;

    public RecipeController(RecipeManagerDbContext context, SpoonacularAPIService data)
    {
        _dbContext = context;
        _ingredientService = data;
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
    
    [HttpGet("favorites/{userId}")]
    [Authorize]
    public IActionResult GetMyFavoriteRecipes(int userId)
    {
        return Ok(_dbContext
            .Favorites
            .Include(f => f.Recipe)
            .Where(f => f.UserProfileId == userId)
            .OrderByDescending(f => f.Recipe.DateCreated));
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetRecipeByIdAsync(int id)
    {
        Recipe foundRecipe = _dbContext.Recipes
        .Include(r => r.UserProfile)
        .Include(r => r.RecipeIngredients)
        .SingleOrDefault(r => r.Id == id);

        foreach(RecipeIngredient recipeIngredient in foundRecipe.RecipeIngredients)
        {
            Ingredient foundIngredient = await _ingredientService.GetById(recipeIngredient.IngredientNumber);
            recipeIngredient.Ingredient = foundIngredient;
        }

        // foundRecipe.RecipeIngredients
        // .Select(async ri => ri.Ingredient = await _ingredientService.GetById(ri.IngredientId));

        return Ok(foundRecipe);
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateRecipe(Recipe recipe) 
    {
        recipe.DateCreated = DateTime.Now;

        _dbContext.Recipes.Add(recipe);
        _dbContext.SaveChanges();

        return Created($"/api/recipe/{recipe.Id}", recipe);
    }

    [HttpPost("recipe-ingredient")]
    [Authorize]
    public IActionResult CreateRecipeIngredient(RecipeIngredient recipeIngredient)
    {
        _dbContext.RecipeIngredients.Add(recipeIngredient);
        _dbContext.SaveChanges();

        return Created($"/api/recipe-ingredient/{recipeIngredient.Id}", recipeIngredient);
    }
}