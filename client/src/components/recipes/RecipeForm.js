import { useState } from "react";
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { getIngredientById, searchIngredients } from "../../managers/ingredientManager";
import { createRecipe, createRecipeIngredient } from "../../managers/recipeManager";
import { useNavigate } from "react-router-dom";

export default function RecipeForm({ loggedInUser }) {
    const [newRecipe, setNewRecipe] = useState({
        name: "",
        instructions: "",
        tagline: "",
        image: ""
    });
    const [stagedRecipeIngredients, setStagedRecipeIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleRecipeChange = (e) => {
        setNewRecipe({
            ...newRecipe,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearchButton = (e) => {
        e.preventDefault();

        searchIngredients(searchTerm)
            .then((res) => setSearchResults(res.results))
    };

    const handleAddIngredient = (e, ingredientId) => {
        e.preventDefault();

        toggleOffcanvas();

        getIngredientById(ingredientId)
            .then((res) => {
                const stagedIngredient = res;
                const clone = structuredClone(stagedRecipeIngredients);
                clone.push(stagedIngredient)
                setStagedRecipeIngredients(clone)        
            })
    };

    const handleRemoveIngredient = (e, ingredientId) => {
        e.preventDefault();

        let clone = structuredClone(stagedRecipeIngredients)
        clone = clone.filter(c => c.id !== ingredientId)
        setStagedRecipeIngredients(clone)
    }

    const handleIngredientChange = (e, sri) => {
        if (e.target.name === "amount")
        {
            let clone = structuredClone(stagedRecipeIngredients);
            let foundIngredient = clone.find((si) => si.id === sri.id);
            foundIngredient.assignedAmount = e.target.value;
            setStagedRecipeIngredients(clone);
        }
        else if (e.target.name === "measurementUnit")
        {
            let clone = structuredClone(stagedRecipeIngredients);
            let foundIngredient = clone.find((si) => si.id === sri.id);
            foundIngredient.assignedUnit = e.target.value;
            setStagedRecipeIngredients(clone);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const recipeToSendToAPI = newRecipe;

        recipeToSendToAPI.userProfileId = loggedInUser.id;

        createRecipe(recipeToSendToAPI)
            .then((res) => {
                for (const sri of stagedRecipeIngredients) {
                    const sriToSendToAPI = {
                        recipeId: res.id,
                        ingredientNumber: sri.id,
                        amount: sri.assignedAmount,
                        measurementUnit: sri.assignedUnit
                    }

                    createRecipeIngredient(sriToSendToAPI)
                }
                navigate(`/recipes/${res.id}`)
            })
    };

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div>
                <h2>Create a new recipe:</h2>
                <Form>
                    <FormGroup>
                        <Label htmlFor="recipeName" style={{marginLeft: "1rem"}}>Recipe Name:</Label>
                        <Input
                            style={{width: "40%", margin:"1rem"}}
                            name="name"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeTagline" style={{marginLeft: "1rem"}}>Tagline:</Label>
                        <Input
                            style={{width: "40%", margin:"1rem"}}
                            name="tagline"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeImage" style={{marginLeft: "1rem"}}>Image URL:</Label>
                        <Input
                            style={{width: "40%", margin:"1rem"}}
                            name="image"
                            type="url"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeInstructions" style={{marginLeft: "1rem"}}>Instructions:</Label>
                        <Input
                            style={{width: "40%", margin:"1rem"}}
                            name="instructions"
                            type="textarea"
                            onChange={handleRecipeChange}
                        />
                    </FormGroup>
                </Form>
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
                    onClick={handleSubmit}
                >
                    Submit Recipe
                </Button>
                <div style={{display: "flex"}}>
                {
                    stagedRecipeIngredients.length > 0
                    ?<>{
                        stagedRecipeIngredients.map((sri) => {
                            const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_500x500/" + sri.image
                            const ingredientName = sri.name.charAt(0).toUpperCase() + sri.name.slice(1)
                            
                            return <Card style={{width:200, margin: "1rem"}} id={sri.id}>
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
                            <CardBody>
                                <Button outline color="danger" onClick={(e) => handleRemoveIngredient(e, sri.id)}>Remove Ingredient</Button>
                                <Label htmlFor="ingredientAmount">Amount:</Label>
                                <Input
                                    name="amount"
                                    type="number"
                                    onChange={(e) => handleIngredientChange(e, sri)}
                                    />
                                <Label htmlFor="ingredientUnit">Measurement Unit</Label>
                                <Input
                                    id="unitSelect"
                                    name="measurementUnit"
                                    type="select"
                                    onChange={(e) => handleIngredientChange(e, sri)}
                                    >
                                    <option>Select a Unit of Measurement</option>
                                    {
                                        sri.possibleUnits.map((pu) => {
                                            return <option value={pu}>{pu}</option>
                                        })
                                    }
                                </Input>
                            </CardBody>
                        </Card>
                        })
                    }</>
                    :<></>
                }
                </div>
                <Offcanvas isOpen={isOpen} toggle={toggleOffcanvas}>
                    <OffcanvasHeader>
                    Find an ingredient to add to your recipe:
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
        </>
    )
}