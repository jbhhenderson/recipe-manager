import { useState } from "react";
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { getIngredientById, searchIngredients } from "../../managers/ingredientManager";
import { createRecipe, createRecipeIngredient } from "../../managers/recipeManager";

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

        getIngredientById(ingredientId)
            .then((res) => {
                const stagedIngredient = res;
                const clone = structuredClone(stagedRecipeIngredients);
                clone.push(stagedIngredient)
                setStagedRecipeIngredients(clone)        
            })
    };

    const handleIngredientChange = (e, sri) => {
        //bug when first assigning values where the form reorders itself
        if (e.target.name === "amount")
        {
            let clone = structuredClone(stagedRecipeIngredients);
            let foundIngredient = clone.find((si) => si.id === sri.id);
            foundIngredient.assignedAmount = e.target.value;
            clone = clone.filter((si) => si.id !== sri.id);
            clone.push(foundIngredient);
            setStagedRecipeIngredients(clone);
        }
        else if (e.target.name === "measurementUnit")
        {
            let clone = structuredClone(stagedRecipeIngredients);
            let foundIngredient = clone.find((si) => si.id === sri.id);
            foundIngredient.assignedUnit = e.target.value;
            clone = clone.filter((si) => si.id !== sri.id);
            clone.push(foundIngredient);
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

                window.location.href = `http://localhost:3000/recipes/${res.id}`
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
                        <Label htmlFor="recipeName">Recipe Name:</Label>
                        <Input
                            name="name"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeTagline">Tagline:</Label>
                        <Input
                            name="tagline"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeImage">Image:</Label>
                        <Input
                            name="image"
                            type="url"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeInstructions">Instructions:</Label>
                        <Input
                            name="instructions"
                            type="textarea"
                            onChange={handleRecipeChange}
                        />
                    </FormGroup>
                </Form>
                <Button
                    color="primary"
                    onClick={toggleOffcanvas}
                >
                    Add Ingredients
                </Button>
                <Button 
                    color="success"
                    onClick={handleSubmit}
                >
                    Submit Recipe
                </Button>
                {
                    stagedRecipeIngredients.length > 0
                    ?<>{
                        stagedRecipeIngredients.map((sri) => {
                            const ingredientImageLink = "https://spoonacular.com/cdn/ingredients_500x500/" + sri.image
                            const ingredientName = sri.name.charAt(0).toUpperCase() + sri.name.slice(1)

                            return <Card style={{width:200}} id={sri.id}>
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
                <Offcanvas isOpen={isOpen} toggle={toggleOffcanvas}>
                    <OffcanvasHeader>
                    Find an ingredient to add to your recipe:
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
        </>
    )
}