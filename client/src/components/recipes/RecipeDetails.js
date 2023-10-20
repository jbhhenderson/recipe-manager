import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addFavorite, getFavoriteStatus, getRecipeById, removeFavorite } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardGroup, CardImg, CardText, CardTitle } from "reactstrap";
import { getIngredientById } from "../../managers/ingredientManager";
import CommentList from "../comments/CommentList";
import { getRecipeComments } from "../../managers/commentManager";

export default function RecipeDetails({ loggedInUser }) {
    const [recipe, setRecipe] = useState([]);
    const [favoriteStatus, setFavoriteStatus] = useState(false);
    const { recipeId } = useParams();
    const [comments, setComments] = useState([]);

    const getThisRecipesComments = () => {
        getRecipeComments(recipeId).then(setComments);
    };

    const getThisRecipe = () => {
        getRecipeById(parseInt(recipeId)).then(setRecipe)
    };

    const getRecipeFavoriteStatus = () => {
      getFavoriteStatus(loggedInUser.id, recipeId).then(setFavoriteStatus)
    }

    const handleAddFavorite = (e) => {
      e.preventDefault();

      addFavorite(loggedInUser.id, recipeId)
        .then(() => getRecipeFavoriteStatus())
    }
    
    const handleRemoveFavorite = (e) => {
      e.preventDefault();

      removeFavorite(loggedInUser.id, recipeId)
        .then(() => getRecipeFavoriteStatus())
    }

    useEffect(() => {
        getThisRecipe();
        getRecipeFavoriteStatus();
        getThisRecipesComments();
    }, []);

    return <Card className="my-2">
    <img
      alt="Card image cap"
      src={recipe.image}
      style={{
        height: 500,
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
      {/* <CardGroup> */}
        {
            recipe?.recipeIngredients?.map((ri) => {
                const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_500x500/" + ri.ingredient.image
                const ingredientName = ri.ingredient.name.charAt(0).toUpperCase() + ri.ingredient.name.slice(1)
                const ingredientAmount = ri.amount
                const ingredientUnit = ri.measurementUnit
                return <Card style={{width:125}}>
                    <img
                        alt="Card image"
                        src={ingredientImageLink}
                        style={{alignSelf: "center"}}
                        //object fit cover?
                        //object position?
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
      {/* </CardGroup> */}
      <CardText>
        Created By: {recipe?.userProfile?.firstName} {recipe?.userProfile?.lastName} On {recipe.dateCreated}
        {
          favoriteStatus === true
          ? <Button color="danger" onClick={handleRemoveFavorite}> Unfavorite </Button>
          : <Button color="success" onClick={handleAddFavorite}> Favorite </Button>
        }
      </CardText>
      <CardText>
        <small className="text-muted">
          {recipe.instructions}
        </small>
      </CardText>
    </CardBody>
    <CommentList loggedInUser={loggedInUser} recipeId={recipe.id} comments={comments} getThisRecipesComments={getThisRecipesComments}/>
  </Card>
}