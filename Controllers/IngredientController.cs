// using Microsoft.AspNetCore.Mvc;
// using RecipeManager.Data;

// namespace RecipeManager.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class IngredientController : ControllerBase
// {
//     private RecipeManagerDbContext _dbContext;
//     private IngredientData ingredients;
//     public IngredientController(RecipeManagerDbContext context, IngredientData data)
//     {
//         _dbContext = context;
//         ingredients = data;
//     }

//     [HttpGet("{id}")]
//     public IActionResult GetById(int id)
//     {
//         return Ok(_dbContext.Ingredients.SingleOrDefault(i => i.Id == id));
//     }
// }