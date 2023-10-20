import { useEffect, useState } from "react";
import { deleteRecipe, getMyRecipes } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardGroup, CardSubtitle, CardText, CardTitle } from "reactstrap";

export default function MyRecipes({loggedInUser}) {
    const [recipes, setRecipes] = useState([]);

    const getAllMyRecipes = () => {
        getMyRecipes(loggedInUser.id).then(setRecipes);
    };

    const handleDetailsButton = (e, recipeId) => {
        e.preventDefault();

        window.location.href = `http://localhost:3000/recipes/${recipeId}`
    };

    const handleDeleteButton = (e, recipeId) => {
        e.preventDefault();

        deleteRecipe(recipeId)
            .then(() => getAllMyRecipes())
    };

    useEffect(() => {
        getAllMyRecipes();
    }, [])

    return (
        <CardGroup>
        {
            recipes.map((r) => {
                return <Card
                    style={{
                        width: '18rem'
                    }}
                >
                    <img
                        alt="Sample"
                        src={r.image}
                        top
                        width= '200rem'
                    />
                    <CardBody>
                        <CardTitle tag="h5">
                            {r.name}
                        </CardTitle>
                        <CardSubtitle
                            className="mb-2 text-muted"
                            tag="h6"
                        >
                            {r.dateCreated}
                        </CardSubtitle>
                        <CardText>
                            {r.tagline}
                        </CardText>
                        <Button 
                            color="primary"
                            onClick={(e) => handleDetailsButton(e, r.id)}
                        >
                            Details
                        </Button>
                        <Button>
                            Edit
                        </Button>
                        <Button
                            color="danger"
                            onClick={(e) => handleDeleteButton(e, r.id)}
                        >
                            Delete
                        </Button>
                    </CardBody>
                </Card>
            })
        }
        </CardGroup>
    )
};