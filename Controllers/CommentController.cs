using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeManager.Data;
using RecipeManager.Models;

namespace RecipeManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private RecipeManagerDbContext _dbContext;

    public CommentController(RecipeManagerDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet("{recipeId}")]
    [Authorize]
    public IActionResult GetRecipeComments(int recipeId)
    {
        return Ok(_dbContext.Comments.Include(c => c.UserProfile).Where(c => c.RecipeId == recipeId));
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateComment(Comment comment)
    {
        _dbContext.Comments.Add(comment);
        _dbContext.SaveChanges();

        return Created($"/api/comment/{comment.Id}", comment);
    }
}