import { useEffect, useState } from "react"
import { getShoppingListIngredientsByUserId } from "../../managers/ingredientManager"

export default function ShoppingList({ loggedInUser }) {
    const [shoppingListIngredients, setShoppingListIngredients] = useState([])

    const getMyShoppingList = () => {
        getShoppingListIngredientsByUserId(loggedInUser.id).then(setShoppingListIngredients)
    }

    useEffect(() => {
        getMyShoppingList()
    }, [])

    return (
        <>
        {
            shoppingListIngredients?.map((sli) => {
                return <p>{sli.ingredient.name} Aisle: {sli.ingredient.aisle} {sli.ingredient.image}</p>
            })
        }
        </>
    )
}