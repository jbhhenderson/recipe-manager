import { useEffect, useState } from "react"
import { addPantryIngredient, getPantryIngredientsByUserId, removePantryItem, searchIngredients } from "../../managers/ingredientManager"
import { Button, Card, CardBody, CardFooter, CardSubtitle, CardTitle, Input, Offcanvas, OffcanvasBody, OffcanvasHeader, Spinner } from "reactstrap"
import "./Pantry.css"

export default function PantryList({ loggedInUser }) {
    const [pantryIngredients, setPantryIngredients] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    
    const getMyPantry = () => {
        getPantryIngredientsByUserId(loggedInUser.id).then(setPantryIngredients);
    };

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };
    
    const handleSearchButton = (e) => {
        e.preventDefault();

        searchIngredients(searchTerm)
            .then((res) => setSearchResults(res.results));
    };

    const handleAddIngredient = (e, ingredientId) => {
        e.preventDefault();

        const ingredientToSendToAPI = {
            ingredientNumber: ingredientId,
            userProfileId: loggedInUser.id
        };

        addPantryIngredient(ingredientToSendToAPI)
            .then(() => getMyPantry());
        toggleOffcanvas();
    };

    const handleRemoveIngredient = (e, userPantryIngredientId) => {
        e.preventDefault();

        removePantryItem(userPantryIngredientId)
            .then(() => getMyPantry())
    }

    useEffect(() => {
        getMyPantry();
    }, []);

    return (
        <div>
            <Button
                outline
                style={{margin: "1rem"}}
                color="primary"
                onClick={toggleOffcanvas}
            >
                Add Ingredients
            </Button>
        <div className="pantryContainer">
        {
            pantryIngredients?.map((pi) => {
                const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_500x500/" + pi.ingredient.image
                const ingredientName = pi.ingredient.name.charAt(0).toUpperCase() + pi.ingredient.name.slice(1)
                
                return <Card style={{width:200, margin: "1rem"}} id={pi.id}>
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
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                        >
                        {pi.ingredient.aisle}
                    </CardSubtitle>
                </CardBody>
                <CardFooter>
                    <Button
                        outline
                        color="danger"
                        onClick={(e) => handleRemoveIngredient(e, pi.id)}
                        >
                        Remove Ingredient
                    </Button>

                </CardFooter>
            </Card>
            })
        }
        </div>
        <Offcanvas isOpen={isOpen} toggle={toggleOffcanvas}>
            <OffcanvasHeader>
            Find ingredients to add to your pantry:
            </OffcanvasHeader>
            <OffcanvasBody>
                <Input
                    style={{marginBottom: "1rem"}}
                    name="searchTerm"
                    placeholder="Search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                    outline
                    style={{marginBottom: "1rem"}}
                    color="primary"
                    onClick={handleSearchButton}
                >
                    Find Ingredients
                </Button>
                {
                    searchResults.length > 0
                    ?<>{
                        searchResults.map((r) => {
                            const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_500x500/" + r.image
                            const ingredientName = r.name.charAt(0).toUpperCase() + r.name.slice(1)

                            return <Card style={{width:200, margin: "1rem"}} id={r.id}>
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
                            </CardBody>
                            <Button
                                outline
                                color="primary"
                                onClick={(e) => handleAddIngredient(e, r.id)}
                            >
                                Add Ingredient
                            </Button>
                        </Card>
                        })
                    }</>
                    :<></>
                }
            </OffcanvasBody>
        </Offcanvas>
        </div>
    )
}