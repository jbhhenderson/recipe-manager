import { useEffect, useState } from "react";
import { getMyRecipes } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";

export default function MyRecipes({loggedInUser}) {
    const [recipes, setRecipes] = useState([]);

    const getAllMyRecipes = () => {
        getMyRecipes(loggedInUser.id).then(setRecipes);
    };

    useEffect(() => {
        getAllMyRecipes();
    }, [])

    return (
        <>
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
                            {r.instructions}
                        </CardText>
                        <Button>
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
        </>
    )
};