import { useEffect, useState } from "react"
import { addShoppingListIngredient, addShoppingListToPantry, getShoppingListIngredientsByUserId, removeShoppingListItem, searchIngredients } from "../../managers/ingredientManager"
import { Button, Card, CardBody, CardFooter, CardSubtitle, CardTitle, Input, Offcanvas, OffcanvasBody, OffcanvasHeader, Spinner } from "reactstrap"
import { useNavigate } from "react-router-dom";

export default function ShoppingList({ loggedInUser }) {
    const [shoppingListIngredients, setShoppingListIngredients] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const getMyShoppingList = () => {
        getShoppingListIngredientsByUserId(loggedInUser.id).then(setShoppingListIngredients)
    }

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

        addShoppingListIngredient(ingredientToSendToAPI)
            .then(() => getMyShoppingList());
        toggleOffcanvas();
    };

    const handleRemoveIngredient = (e, shoppingListIngredientId) => {
        e.preventDefault();

        removeShoppingListItem(shoppingListIngredientId)
            .then(() => getMyShoppingList())
    }

    const handleAddToPantry = (e) => {
        e.preventDefault();

        addShoppingListToPantry(loggedInUser.id)
            .then(() => navigate("/my-pantry"))
    }

    useEffect(() => {
        getMyShoppingList()
    }, [])

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
            <Button
                outline
                color="success"
                onClick={handleAddToPantry}
            >
                Add List to Pantry
            </Button>
            <div className="pantryContainer">
        {
            shoppingListIngredients?.map((sli) => {
                const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_500x500/" + sli.ingredient.image
                const ingredientName = sli.ingredient.name.charAt(0).toUpperCase() + sli.ingredient.name.slice(1)

                return <Card style={{width:200, margin: "1rem"}} id={sli.id}>
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
                        {sli.ingredient.aisle}
                    </CardSubtitle>
                </CardBody>
                <CardFooter>
                    <Button
                    outline
                    color="danger"
                    onClick={(e) => handleRemoveIngredient(e, sli.id)}
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