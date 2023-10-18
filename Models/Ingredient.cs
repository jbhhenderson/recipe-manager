using System.Text.Json.Serialization;

public class Ingredient
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set;}
    [JsonPropertyName("aisle")]
    public string Aisle { get; set; }
    [JsonPropertyName("image")]
    public string Image { get; set; }
    [JsonPropertyName("possibleUnits")]
    public List<string> PossibleUnits { get; set; }
}