import { useEffect, useState } from "react";
import { getMyFavoriteRecipes } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardGroup, CardSubtitle, CardText, CardTitle } from "reactstrap";
import "./Recipe.css"

export default function MyFavoriteRecipes({loggedInUser}) {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    const getAllMyFavoriteRecipes = () => {
        getMyFavoriteRecipes(loggedInUser.id).then(setFavoriteRecipes);
    };

    const handleDetailsButton = (e, recipeId) => {
        e.preventDefault();

        window.location.href = `http://localhost:3000/recipes/${recipeId}`
    };

    useEffect(() => {
        getAllMyFavoriteRecipes();
    }, [])

    return (
        <div className="recipeContainer">
        {
            favoriteRecipes.map((fr) => {
                return <Card
                    style={{
                        width: '18rem',
                        margin: "1rem"
                    }}
                >
                    <img
                        alt="Sample"
                        src={fr.recipe.image}
                        top
                        width= '286rem'
                        height= '300 rem'
                    />
                    <CardBody>
                        <CardTitle tag="h5">
                            {fr.recipe.name}
                        </CardTitle>
                        <CardSubtitle
                            className="mb-2 text-muted"
                            tag="h6"
                        >
                            {fr.recipe.dateCreated.split("T")[0]}
                        </CardSubtitle>
                        <CardText>
                            {fr.recipe.tagline}
                        </CardText>
                        <Button 
                            outline
                            color="primary"
                            onClick={(e) => handleDetailsButton(e, fr.recipe.id)}
                        >
                            Details
                        </Button>
                    </CardBody>
                </Card>
            })
        }
        </div>
    )
};