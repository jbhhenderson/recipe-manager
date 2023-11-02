import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { getIngredientById, searchIngredients } from "../../managers/ingredientManager";
import { createRecipe, createRecipeIngredient, getRecipeById, updateRecipe } from "../../managers/recipeManager";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRecipe({ loggedInUser }) {
    const [newRecipe, setNewRecipe] = useState({});
    const [stagedRecipeIngredients, setStagedRecipeIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { recipeId } = useParams();

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
                const stagedIngredient = {
                    id: res.id,
                    name: res.name,
                    recipeId: parseInt(recipeId),
                    aisle: res.aisle,
                    image: res.image,
                    possibleUnits: res.possibleUnits,
                    amount: 0,
                    measurementUnit: ""
                };
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
            foundIngredient.amount = parseInt(e.target.value);
            setStagedRecipeIngredients(clone);
        }
        else if (e.target.name === "measurementUnit")
        {
            let clone = structuredClone(stagedRecipeIngredients);
            let foundIngredient = clone.find((si) => si.id === sri.id);
            foundIngredient.measurementUnit = e.target.value;
            setStagedRecipeIngredients(clone);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const recipeToSendToAPI = {
            id: newRecipe.id,
            userProfileId: newRecipe.userProfileId,
            dateCreated: newRecipe.dateCreated,
            name: newRecipe.name,
            instructions: newRecipe.instructions,
            tagline: newRecipe.tagline,
            image: newRecipe.image,
            recipeIngredients: []
        }

        for (const sri of stagedRecipeIngredients) {
            const recipeIngredient = {
                recipeId: parseInt(recipeId),
                ingredientNumber: parseInt(sri.id),
                amount: parseInt(sri.amount),
                measurementUnit: sri.measurementUnit
            }

            recipeToSendToAPI.recipeIngredients.push(recipeIngredient)
        }

        updateRecipe(recipeToSendToAPI)
            .then(() => navigate(`/recipes/${recipeToSendToAPI.id}`))
    };

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };

    const getThisRecipe = () => {
        getRecipeById(recipeId).then((res) => {
            setNewRecipe(res)
            const recipeIngredients = res.recipeIngredients
            const ingredientArray = []
            for (const ri of recipeIngredients) {
                const stagedIngredient = ri.ingredient
                stagedIngredient.amount = ri.amount
                stagedIngredient.measurementUnit = ri.measurementUnit
                
                ingredientArray.push(stagedIngredient)
            }
            setStagedRecipeIngredients(ingredientArray)
        })
    };

    useEffect(() => {
        getThisRecipe();
    }, []);

    return (
        <>
            <div>
                <h2>Edit your recipe:</h2>
                <Form>
                    <FormGroup>
                        <Label htmlFor="recipeName" style={{marginLeft: "1rem"}}>Recipe Name:</Label>
                        <Input
                            style={{width: "40%", margin:"1rem"}}
                            value={newRecipe.name}
                            name="name"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeTagline" style={{marginLeft: "1rem"}}>Tagline:</Label>
                        <Input
                            style={{width: "40%", margin:"1rem"}}
                            value={newRecipe.tagline}
                            name="tagline"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeImage" style={{marginLeft: "1rem"}}>Image:</Label>
                        <Input
                            style={{width: "40%", margin:"1rem"}}
                            value={newRecipe.image}
                            name="image"
                            type="url"
                            onChange={handleRecipeChange}
                        />
                        <Label htmlFor="recipeInstructions" style={{marginLeft: "1rem"}}>Instructions:</Label>
                        <Input
                            style={{width: "40%", margin:"1rem"}}
                            value={newRecipe.instructions}
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
                        stagedRecipeIngredients?.map((sri) => {
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
                                <Button outline color="danger" onClick={(e) => handleRemoveIngredient(e, sri.id)}>Remove Ingredient</Button>
                                <Label htmlFor="ingredientAmount">Amount:</Label>
                                <Input
                                    value={sri.amount}
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
                                            let selectedStatus = false
                                            if (pu === sri.measurementUnit) {
                                                selectedStatus = true
                                            }
                                            return <option selected={selectedStatus} value={pu}>{pu}</option>
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