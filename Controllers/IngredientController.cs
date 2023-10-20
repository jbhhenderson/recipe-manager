using Microsoft.AspNetCore.Authorization;
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

    [HttpPost("pantry")]
    [Authorize]
    public IActionResult AddPantryItem(UserPantryItem userPantryItem)
    {
        _dbContext.UserPantryItems.Add(userPantryItem);
        _dbContext.SaveChanges();

        return Created($"/api/pantry/{userPantryItem.UserProfileId}/{userPantryItem.IngredientNumber}", userPantryItem);
    }

    [HttpDelete("pantry/{id}")]
    [Authorize]
    public IActionResult RemovePantryItem(int id)
    {
        UserPantryItem foundItem = _dbContext.UserPantryItems.SingleOrDefault(upi => upi.Id == id);

        if (foundItem == null)
        {
            return BadRequest();
        }

        _dbContext.UserPantryItems.Remove(foundItem);
        _dbContext.SaveChanges();

        return NoContent();
    }
    
    [HttpGet("shopping-list/{userId}")]
    public async Task<IActionResult> GetShoppingListByUserId(int userId)
    {
        var foundUserShoppingListIngredients = _dbContext.ShoppingListItems.Where(sli => sli.UserProfileId == userId);

        foreach (ShoppingListItem sli in foundUserShoppingListIngredients)
        {
            Ingredient foundIngredient = await _ingredientService.GetById(sli.IngredientNumber);
            sli.Ingredient = foundIngredient;
        }

        foundUserShoppingListIngredients.OrderBy(i => i.Ingredient.Aisle);

        return Ok(foundUserShoppingListIngredients);
    }

    [HttpPost("shopping-list")]
    [Authorize]
    public IActionResult AddShoppingListItem(ShoppingListItem shoppingListItem)
    {
        _dbContext.ShoppingListItems.Add(shoppingListItem);
        _dbContext.SaveChanges();

        return Created($"/api/pantry/{shoppingListItem.UserProfileId}/{shoppingListItem.IngredientNumber}", shoppingListItem);
    }

    [HttpDelete("shopping-list/{id}")]
    [Authorize]
    public IActionResult RemoveShoppingListItem(int id)
    {
        ShoppingListItem foundItem = _dbContext.ShoppingListItems.SingleOrDefault(sli => sli.Id == id);

        if (foundItem == null)
        {
            return BadRequest();
        }

        _dbContext.ShoppingListItems.Remove(foundItem);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpGet("search-ingredients/{ingredientName}")]
    public async Task<IActionResult> GetSearchResults(string ingredientName)
    {
        Object searchResult = await _ingredientService.SearchIngredients(ingredientName);

        return Ok(searchResult);
    }
}