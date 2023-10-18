using Microsoft.AspNetCore.Mvc;
using RecipeManager.Data;
using RecipeManager.Models;

namespace RecipeManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IngredientController : ControllerBase
{
    private RecipeManagerDbContext _dbContext;
    private SpoonacularAPIService _ingredientService;
    public IngredientController(RecipeManagerDbContext context, SpoonacularAPIService data)
    {
        _dbContext = context;
        _ingredientService = data;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ingredient = await _ingredientService.GetById(id);
        return Ok(ingredient);
    }

    [HttpGet("pantry/{userId}")]
    public async Task<IActionResult> GetPantryByUserId(int userId)
    {
        var foundUserPantryIngredients = _dbContext.UserPantryItems.Where(upi => upi.UserProfileId == userId);

        foreach (UserPantryItem upi in foundUserPantryIngredients)
        {
            Ingredient foundIngredient = await _ingredientService.GetById(upi.IngredientNumber);
            upi.Ingredient = foundIngredient;
        }

        foundUserPantryIngredients.OrderBy(i => i.Ingredient.Aisle);

        return Ok(foundUserPantryIngredients);
    }
}