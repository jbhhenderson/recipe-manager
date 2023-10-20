import { useEffect, useState } from "react"
import { addPantryIngredient, getPantryIngredientsByUserId, searchIngredients } from "../../managers/ingredientManager"
import { Button, Card, CardBody, CardSubtitle, CardTitle, Input, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap"

export default function PantryList({ loggedInUser }) {
    const [pantryIngredients, setPantryIngredients] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        getMyPantry()
    }, [])
    
    const getMyPantry = () => {
        getPantryIngredientsByUserId(loggedInUser.id).then(setPantryIngredients)
    }

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };
    
    const handleSearchButton = (e) => {
        e.preventDefault();

        searchIngredients(searchTerm)
            .then((res) => setSearchResults(res.results))
    };

    const handleAddIngredient = (e, ingredientId) => {
        e.preventDefault();

        const ingredientToSendToAPI = {
            ingredientNumber: ingredientId,
            userProfileId: loggedInUser.id
        }

        addPantryIngredient(ingredientToSendToAPI)
            .then(() => getMyPantry())
    };

    return (
        <div>
            <Button
                color="primary"
                onClick={toggleOffcanvas}
            >
                Add Ingredients
            </Button>
        {
            pantryIngredients?.map((pi) => {
                const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_500x500/" + pi.ingredient.image
                const ingredientName = pi.ingredient.name.charAt(0).toUpperCase() + pi.ingredient.name.slice(1)

                return <Card style={{width:200}} id={pi.id}>
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
            </Card>
            })
        }
        <Offcanvas isOpen={isOpen} toggle={toggleOffcanvas}>
            <OffcanvasHeader>
            Find ingredients to add to your pantry:
            </OffcanvasHeader>
            <OffcanvasBody>
                <Input
                    name="searchTerm"
                    placeholder="Search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
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

                            return <Card style={{width:200}} id={r.id}>
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