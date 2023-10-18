using System.Net;

namespace RecipeManager.Data;

public class SpoonacularAPIService
{
    private HttpClient _client;

    private IConfiguration _configuration;

    public SpoonacularAPIService(IConfiguration config)
    {
        _client = new HttpClient();
        _configuration = config;
    }

    public async Task<Ingredient> GetById(int id)
    {
        var uri = $"https://api.spoonacular.com/food/ingredients/{id}/information?apiKey={_configuration["spoonAPIKey"]}";

        var foundIngredient = await _client.GetFromJsonAsync<Ingredient>(uri);

        return foundIngredient;
    }
}