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
    // public async Task<IActionResult> Get()
    {
        List<Recipe> allRecipes = _dbContext.Recipes.OrderByDescending(r => r.DateCreated).ToList();
        // List<Recipe> allRecipes = _dbContext.Recipes
        // .Include(r => r.RecipeIngredients)
        // .OrderByDescending(r => r.DateCreated).ToList();

        // foreach (Recipe recipe in allRecipes)
        // {
        //     foreach(RecipeIngredient recipeIngredient in recipe.RecipeIngredients)
        //     {
        //         Ingredient foundIngredient = await _ingredientService.GetById(recipeIngredient.IngredientNumber);
        //         recipeIngredient.Ingredient = foundIngredient;            
        //     }
        // }

        return Ok(allRecipes);
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

    [HttpDelete("{recipeId}")]
    [Authorize]
    public IActionResult DeleteRecipe(int recipeId)
    {
        Recipe foundRecipe = _dbContext.Recipes.SingleOrDefault(r => r.Id == recipeId);

        _dbContext.Remove(foundRecipe);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPost("recipe-ingredient")]
    [Authorize]
    public IActionResult CreateRecipeIngredient(RecipeIngredient recipeIngredient)
    {
        _dbContext.RecipeIngredients.Add(recipeIngredient);
        _dbContext.SaveChanges();

        return Created($"/api/recipe-ingredient/{recipeIngredient.Id}", recipeIngredient);
    }

    [HttpPost("user/{userId}/favorite/recipe/{recipeId}")]
    [Authorize]
    public IActionResult AddFavoriteRecipe(int userId, int recipeId)
    {
        Favorite favorite = new() {
            RecipeId = recipeId,
            UserProfileId = userId
        };
        _dbContext.Favorites.Add(favorite);
        _dbContext.SaveChanges();

        return Created($"/api/recipe/favorite/{favorite.Id}", favorite);
    }

    [HttpDelete("user/{userId}/favorite/recipe/{recipeId}")]
    [Authorize]
    public IActionResult RemoveFavoriteRecipe(int userId, int recipeId)
    {
        Favorite foundFavorite = _dbContext.Favorites.SingleOrDefault(f => f.RecipeId == recipeId && f.UserProfileId == userId);

        if (foundFavorite == null) 
        {
            return BadRequest();
        }

        _dbContext.Favorites.Remove(foundFavorite);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpGet("user/{userId}/recipe/{recipeId}/is-favorite")]
    [Authorize]
    public IActionResult CheckFavoriteStatus(int userId, int recipeId)
    {
        Favorite foundFavorite = _dbContext.Favorites.SingleOrDefault(f => f.RecipeId == recipeId && f.UserProfileId == userId);

        if (foundFavorite == null)
        {
            return Ok(false);
        }
        else
        {
            return Ok(true);
        }
    }
}