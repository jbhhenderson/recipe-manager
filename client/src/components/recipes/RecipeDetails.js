import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../../managers/recipeManager";
import { Card, CardBody, CardGroup, CardImg, CardText, CardTitle } from "reactstrap";
import { getIngredientById } from "../../managers/ingredientManager";

export default function RecipeDetails() {
    const [recipe, setRecipe] = useState([]);
    const { recipeId } = useParams();

    const getThisRecipe = () => {
        getRecipeById(parseInt(recipeId)).then(setRecipe)
    };

    useEffect(() => {
        getThisRecipe();
    }, []);

    return <Card className="my-2">
    <CardImg
      alt="Card image cap"
      src={recipe.image}
      style={{
        height: 500
      }}
      top
      width="50%"
    />
    <CardBody>
      <CardTitle tag="h5">
        {recipe.name}
      </CardTitle>
      <CardText>
        {recipe.tagline}
      </CardText>
      <CardGroup>
        {
            recipe?.recipeIngredients?.map((ri) => {
                const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_100x100/" + ri.ingredient.image
                const ingredientName = ri.ingredient.name.charAt(0).toUpperCase() + ri.ingredient.name.slice(1)
                const ingredientAmount = ri.amount
                const ingredientUnit = ri.measurementUnit
                return <Card>
                    <CardImg
                        alt="Card image"
                        src={ingredientImageLink}
                        top
                        width="100px"
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
      </CardGroup>
      <CardText>
        Created By: {recipe?.userProfile?.firstName} {recipe?.userProfile?.lastName} On {recipe.dateCreated}
      </CardText>
      <CardText>
        <small className="text-muted">
          {recipe.instructions}
        </small>
      </CardText>
    </CardBody>
  </Card>
}