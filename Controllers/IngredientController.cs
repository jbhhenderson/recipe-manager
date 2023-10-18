using Microsoft.AspNetCore.Mvc;
using RecipeManager.Data;

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
}