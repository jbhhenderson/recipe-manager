using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using RecipeManager.Models;
using Microsoft.AspNetCore.Identity;

namespace RecipeManager.Data;
public class RecipeManagerDbContext : IdentityDbContext<IdentityUser>
{
    private readonly IConfiguration _configuration;
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<UserPantryItem> UserPantryItems { get; set; }
    public DbSet<ShoppingListItem> ShoppingListItems { get; set; }
    public DbSet<Recipe> Recipes { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<RecipeIngredient> RecipeIngredients { get; set; }

    public RecipeManagerDbContext(DbContextOptions<RecipeManagerDbContext> context, IConfiguration config) : base(context)
    {
        _configuration = config;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
        {
            Id = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
            Name = "Admin",
            NormalizedName = "admin"
        });

        modelBuilder.Entity<IdentityUser>().HasData(new IdentityUser
        {
            Id = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            UserName = "Administrator",
            Email = "admina@strator.comx",
            PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(null, _configuration["AdminPassword"])
        });

        modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
        {
            RoleId = "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
            UserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f"
        });

        modelBuilder.Entity<UserProfile>().HasData(new UserProfile
        {
            Id = 1,
            IdentityUserId = "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
            FirstName = "Admina",
            LastName = "Strator",
            Address = "101 Main Street",
        });

        modelBuilder.Entity<UserPantryItem>().HasData(new UserPantryItem[]
        {
            new()
            {
                Id = 1,
                UserProfileId = 1,
                IngredientId = 9003
            },
            new()
            {
                Id = 2,
                UserProfileId = 1,
                IngredientId = 9021
            }
        });

        modelBuilder.Entity<ShoppingListItem>().HasData(new ShoppingListItem[]
        {
            new()
            {
                Id = 1,
                UserProfileId = 1,
                IngredientId = 10123
            },
            new()
            {
                Id = 2,
                UserProfileId = 1,
                IngredientId = 18033
            }
        });

        modelBuilder.Entity<Recipe>().HasData(new Recipe[]
        {
            new()
            {
                Id = 1,
                UserProfileId = 1,
                DateCreated = new DateTime(2023, 10, 15, 18, 0, 0),
                Instructions = "Just put them in the oven for a bit",
                Image = "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Frichmedia.channeladvisor.com%2FImageDelivery%2FimageService%3FprofileId%3D52000717%26imageID%3D32353%26recipeId%3D243&f=1&nofb=1&ipt=9f97d76f38908a71cffdb9814880702a653d70977380ae4fbe6c3b0aa9fbc4bd&ipo=images"
            }
        });

        modelBuilder.Entity<Favorite>().HasData(new Favorite[]
        {
            new()
            {
                Id = 1,
                UserProfileId = 1,
                RecipeId = 1
            }
        });

        modelBuilder.Entity<Comment>().HasData(new Comment[]
        {
            new()
            {
                Id = 1,
                UserProfileId = 1,
                RecipeId = 1,
                Body = "I LOVE PIZZA ROLLS!!!!!"
            }
        });

        modelBuilder.Entity<RecipeIngredient>().HasData(new RecipeIngredient[]
        {
            new()
            {
                Id = 1,
                RecipeId = 1,
                IngredientId = 9003,
                Amount = 4,
                MeasurementUnit = "Fruit"
            },
            new()
            {
                Id = 2,
                RecipeId = 1,
                IngredientId = 9004,
                Amount = 1,
                MeasurementUnit = "Serving"
            }
        });
    }
}