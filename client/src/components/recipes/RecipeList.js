import { useEffect, useState } from "react";
import { getRecipes } from "../../managers/recipeManager";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./Recipe.css"

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate();

    const getAllRecipes = () => {
        getRecipes().then(setRecipes);
    };

    const handleDetailsButton = (e, recipeId) => {
        e.preventDefault();

        navigate(`${recipeId}`)
    };

    useEffect(() => {
        getAllRecipes();
    }, [])

    return (
        <>
        <Input
            name="searchTerm"
            placeholder="Search"
            style={{width: "20%", margin: "1rem"}}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="recipeContainer">
        {
            recipes.map((r) => {
                if (searchTerm === "") {
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
                            color="primary"
                            onClick={(e) => handleDetailsButton(e, r.id)}
                        >
                            Details
                        </Button>
                    </CardBody>
                </Card>
                // } else if (searchTerm !== "" && (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.recipeIngredients.some(ri => ri.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())))) {
                } else if (searchTerm !== "" && r.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return <Card
                    style={{
                        width: '18rem'
                    }}
                    >
                    <img
                        alt="Sample"
                        src={r.image}
                        top
                        width= '287rem'
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
                            {r.dateCreated}
                        </CardSubtitle>
                        <CardText>
                            {r.tagline}
                        </CardText>
                        <Button 
                            onClick={(e) => handleDetailsButton(e, r.id)}
                            >
                            Details
                        </Button>
                    </CardBody>
                </Card>
                }
            })
        }
        </div>
        </>
    )
};