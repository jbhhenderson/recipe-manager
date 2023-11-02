import { useEffect, useState } from "react";
import { deleteRecipe, getMyRecipes } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardGroup, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./Recipe.css"

export default function MyRecipes({loggedInUser}) {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    const getAllMyRecipes = () => {
        getMyRecipes(loggedInUser.id).then(setRecipes);
    };

    const handleDetailsButton = (e, recipeId) => {
        e.preventDefault();

        navigate(`/recipes/${recipeId}`)
    };
    
    const handleEditButton = (e, recipeId) => {
        e.preventDefault();

        navigate(`/recipes/edit/${recipeId}`)
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
        <div className="recipeContainer">
        {
            recipes.map((r) => {
                return <Card
                    style={{
                        width: '18rem',
                        margin: "1rem"
                    }}
                >
                    <img
                        alt="Sample"
                        src={r.image}
                        top
                        width= '286rem'
                        height= '300 rem'
                    />
                    <CardBody>
                        <CardTitle tag="h5">
                            {r.name}
                        </CardTitle>
                        <CardSubtitle
                            className="mb-2 text-muted"
                            tag="h6"
                        >
                            {r.dateCreated.split("T")[0]}
                        </CardSubtitle>
                        <CardText>
                            {r.tagline}
                        </CardText>
                        <Button 
                            outline
                            style={{marginRight: "1rem"}}
                            color="primary"
                            onClick={(e) => handleDetailsButton(e, r.id)}
                        >
                            Details
                        </Button>
                        <Button
                            outline
                            style={{marginRight: "1rem"}}
                            color="success"
                            onClick={(e) => handleEditButton(e, r.id)}
                        >
                            Edit
                        </Button>
                        <Button
                            outline
                            color="danger"
                            onClick={(e) => handleDeleteButton(e, r.id)}
                        >
                            Delete
                        </Button>
                    </CardBody>
                </Card>
            })
        }
        </div>
    )
};