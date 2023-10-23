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

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteComment(int id)
    {
        Comment foundComment = _dbContext.Comments.SingleOrDefault(c => c.Id == id);

        _dbContext.Remove(foundComment);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult EditComment(int id, Comment editedComment)
    {
        Comment foundComment = _dbContext.Comments.SingleOrDefault(c => c.Id == id);
        foundComment.Body = editedComment.Body;
        _dbContext.SaveChanges();
        return NoContent();
    }
}