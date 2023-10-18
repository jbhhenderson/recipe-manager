import { useEffect, useState } from "react"
import { getPantryIngredientsByUserId } from "../../managers/ingredientManager"

export default function PantryList({ loggedInUser }) {
    const [pantryIngredients, setPantryIngredients] = useState([])

    const getMyPantry = () => {
        getPantryIngredientsByUserId(loggedInUser.id).then(setPantryIngredients)
    }

    useEffect(() => {
        getMyPantry()
    }, [])

    return (
        <>
        {
            pantryIngredients?.map((pi) => {
                return <p>{pi.ingredient.name} Aisle: {pi.ingredient.aisle} {pi.ingredient.image}</p>
            })
        }
        </>
    )
}