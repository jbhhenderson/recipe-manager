import { useEffect, useState } from "react";
import { getMyFavoriteRecipes } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardGroup, CardSubtitle, CardText, CardTitle } from "reactstrap";

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
        <CardGroup>
        {
            favoriteRecipes.map((fr) => {
                return <Card
                    style={{
                        width: '18rem'
                    }}
                >
                    <img
                        alt="Sample"
                        src={fr.recipe.image}
                        top
                        width= '200rem'
                    />
                    <CardBody>
                        <CardTitle tag="h5">
                            {fr.recipe.name}
                        </CardTitle>
                        <CardSubtitle
                            className="mb-2 text-muted"
                            tag="h6"
                        >
                            {fr.recipe.dateCreated}
                        </CardSubtitle>
                        <CardText>
                            {fr.recipe.tagline}
                        </CardText>
                        <Button 
                            onClick={(e) => handleDetailsButton(e, fr.recipe.id)}
                        >
                            Details
                        </Button>
                        <Button>
                            Edit
                        </Button>
                        <Button>
                            Delete
                        </Button>
                    </CardBody>
                </Card>
            })
        }
        </CardGroup>
    )
};