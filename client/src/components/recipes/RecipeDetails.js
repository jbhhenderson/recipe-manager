import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addFavorite, getFavoriteStatus, getRecipeById, removeFavorite } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardGroup, CardImg, CardText, CardTitle, Spinner } from "reactstrap";
import { addMissingRecipeIngredientsToShoppingList, cookIngredients, getIngredientById, getPantryIngredientsByUserId } from "../../managers/ingredientManager";
import CommentList from "../comments/CommentList";
import { getRecipeComments } from "../../managers/commentManager";

export default function RecipeDetails({ loggedInUser }) {
    const [recipe, setRecipe] = useState([]);
    const [favoriteStatus, setFavoriteStatus] = useState(false);
    const [comments, setComments] = useState([]);
    const [pantryIngredients, setPantryIngredients] = useState([]);
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const getThisRecipesComments = () => {
        getRecipeComments(recipeId).then(setComments);
    };

    const getThisRecipe = () => {
        getRecipeById(parseInt(recipeId)).then(setRecipe)
    };

    const getRecipeFavoriteStatus = () => {
      getFavoriteStatus(loggedInUser.id, recipeId).then(setFavoriteStatus)
    };

    const getPantryIngredients = () => {
      getPantryIngredientsByUserId(loggedInUser.id).then((res) => {
        let ingredientsInPantry = [];

        for (const pantryIngredient of res) {
          ingredientsInPantry.push(pantryIngredient.ingredient)
        }

        setPantryIngredients(ingredientsInPantry);
      })
    };

    const handleAddFavorite = (e) => {
      e.preventDefault();

      addFavorite(loggedInUser.id, recipeId)
        .then(() => getRecipeFavoriteStatus())
    };
    
    const handleRemoveFavorite = (e) => {
      e.preventDefault();

      removeFavorite(loggedInUser.id, recipeId)
        .then(() => getRecipeFavoriteStatus())
    };

    const handleCookButton = (e) => {
      e.preventDefault();

      cookIngredients(loggedInUser.id, recipeId)
        .then(() => navigate("/my-pantry"))
    };

    const handleMissingIngredientsButton = (e) => {
      e.preventDefault();

      addMissingRecipeIngredientsToShoppingList(loggedInUser.id, recipeId)
        .then(() => navigate("/my-shopping-list"))
    };

    useEffect(() => {
        getThisRecipe();
        getRecipeFavoriteStatus();
        getThisRecipesComments();
        getPantryIngredients();
    }, []);

    if (recipe.image === "") {
      return <Spinner />
    }

    return <div className="recipeDetailsContainer">
      <Card className="my-2" style={{width: "75%"}}>
    <img
      alt="Card image cap"
      src={recipe.image}
      style={{
        height: "30rem",
        width: "30rem",
        alignSelf: "center"
      }}
      top
      width="500"
      />
    <CardBody>
      <CardTitle tag="h5">
        {recipe.name}
      </CardTitle>
      <CardText>
        {recipe.tagline}
      </CardText>
      <div className="ingredientContainer">
        {
          recipe?.recipeIngredients?.map((ri) => {
                const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_500x500/" + ri.ingredient.image
                const ingredientName = ri.ingredient.name.charAt(0).toUpperCase() + ri.ingredient.name.slice(1)
                const ingredientAmount = ri.amount
                const ingredientUnit = ri.measurementUnit
                let cardColor = "danger"
                pantryIngredients.map((pi) => {
                  if (pi.id === ri.ingredient.id) {
                    cardColor = ""
                  }
                })
                return <Card style={{width:125, marginRight: "1rem", marginBottom: "1rem"}} color={cardColor}>
                    <img
                        alt="Card image"
                        src={ingredientImageLink}
                        style={{alignSelf: "center"}}
                        width="100px"
                        height="100px"
                        />
                    <CardBody>
                        <CardTitle tag="h5">
                            {ingredientName}
                        </CardTitle>
                        <CardText>
                            {`${ingredientAmount} ${ingredientUnit}`}
                        </CardText>
                    </CardBody>
                </Card>
            })
        }
      </div>
      <CardText>
        Created By: {recipe?.userProfile?.firstName} {recipe?.userProfile?.lastName} On {recipe.dateCreated?.split("T")[0]}
        {
          favoriteStatus === true
          ? <Button outline color="danger" style={{marginRight: "1rem", marginLeft:"1rem"}} onClick={handleRemoveFavorite}> Unfavorite </Button>
          : <Button outline color="success" style={{marginRight: "1rem", marginLeft:"1rem"}} onClick={handleAddFavorite}> Favorite </Button>
        }
        <Button outline color="info" style={{marginRight: "1rem"}} onClick={handleCookButton}>I Cooked This</Button>
        <Button outline color="primary" onClick={handleMissingIngredientsButton}>Add Missing Ingredients</Button>
      </CardText>
      <CardText>
        <small className="text-muted">
          {recipe.instructions}
        </small>
      </CardText>
    </CardBody>
  </Card>
    <div style={{width: "30%"}} >
      <CommentList loggedInUser={loggedInUser} recipeId={recipe.id} comments={comments} getThisRecipesComments={getThisRecipesComments}/>
    </div>
  </div>
}