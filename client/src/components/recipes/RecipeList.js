import { useEffect, useState } from "react";
import { getRecipes } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);

    const getAllRecipes = () => {
        getRecipes().then(setRecipes);
    };

    useEffect(() => {
        getAllRecipes();
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
                    </CardBody>
                </Card>
            })
        }
        </>
    )
};