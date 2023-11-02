using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var ingredient = await _ingredientService.GetById(id);
        return Ok(ingredient);
    }

    [HttpGet("pantry/{userId}")]
    [Authorize]
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
    [Authorize]
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

    [HttpPost("{userId}/add-recipe-ingredients-to-shopping-list/{recipeId}")]
    [Authorize]
    public IActionResult AddRecipeIngredientsToShoppingList(int userId, int recipeId)
    {
        List<int> foundRecipeIngredients = _dbContext.RecipeIngredients.Where(ri => ri.RecipeId == recipeId).Select(ri => ri.IngredientNumber).ToList();

        List<int> foundUserPantryItems = _dbContext.UserPantryItems.Where(upi => upi.UserProfileId == userId).Select(upi => upi.IngredientNumber).ToList();

        List<int> missingIngredients = new();

        foreach (int ingredient in foundRecipeIngredients)
        {
            if (!foundUserPantryItems.Contains(ingredient))
            {
                missingIngredients.Add(ingredient);
            } 
        }

        foreach (int ingredient in missingIngredients)
        {
            ShoppingListItem missingIngredient = new()
                {
                    UserProfileId = userId,
                    IngredientNumber = ingredient
                };

                _dbContext.ShoppingListItems.Add(missingIngredient);
                _dbContext.SaveChanges();
        }


        return NoContent();
    }

    [HttpPost("add-shopping-list-to-pantry/{userId}")]
    [Authorize]
    public IActionResult AddShoppingListToPantry(int userId)
    {
        List<ShoppingListItem> userShoppingList = _dbContext.ShoppingListItems.Where(sli => sli.UserProfileId == userId).ToList();

        foreach (ShoppingListItem shoppingListItem in userShoppingList)
        {
            ShoppingListItem foundItem = _dbContext.ShoppingListItems.SingleOrDefault(sli => sli.UserProfileId == shoppingListItem.UserProfileId && sli.IngredientNumber == shoppingListItem.IngredientNumber);

            UserPantryItem userPantryItem = new()
            {
                IngredientNumber = shoppingListItem.IngredientNumber,
                UserProfileId = userId
            };

            _dbContext.ShoppingListItems.Remove(foundItem);
            _dbContext.UserPantryItems.Add(userPantryItem);
        }

        _dbContext.SaveChanges();

        return NoContent();
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
    [Authorize]
    public async Task<IActionResult> GetSearchResults(string ingredientName)
    {
        Object searchResult = await _ingredientService.SearchIngredients(ingredientName);

        return Ok(searchResult);
    }

    [HttpDelete("{userId}/cook/{recipeId}")]
    [Authorize]
    public IActionResult CookIngredients(int userId, int recipeId)
    {
        List<RecipeIngredient> recipeIngredients = _dbContext.RecipeIngredients.Where(ri => ri.RecipeId == recipeId).ToList();

        foreach (RecipeIngredient recipeIngredient in recipeIngredients) 
        {
            UserPantryItem foundPantryItem = _dbContext.UserPantryItems.SingleOrDefault(upi => upi.IngredientNumber == recipeIngredient.IngredientNumber && upi.UserProfileId == userId);

            if (foundPantryItem != null)
            {                
                _dbContext.UserPantryItems.Remove(foundPantryItem);
            }
        }

        _dbContext.SaveChanges();

        return NoContent();
    }
}