const _apiUrl = "/api/ingredient";

export const getIngredientById = async (id) => {
    return await fetch(`${_apiUrl}/${id}`).then((res) => res.json());
};

export const getPantryIngredientsByUserId = async (userId) => {
    return await fetch(`${_apiUrl}/pantry/${userId}`).then((res) => res.json());
};

export const addPantryIngredient = (userPantryItem) => {
    return fetch(`${_apiUrl}/pantry`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userPantryItem)
    }).then((res) => res.json())
}

export const removePantryItem = (userPantryItemId) => {
    return fetch(`${_apiUrl}/pantry/${userPantryItemId}`, {
        method: "DELETE"
    })
}

export const getShoppingListIngredientsByUserId = async (userId) => {
    return await fetch(`${_apiUrl}/shopping-list/${userId}`).then((res) => res.json());
};

export const addShoppingListIngredient = (shoppingListIngredient) => {
    return fetch(`${_apiUrl}/shopping-list`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(shoppingListIngredient)
    }).then((res) => res.json())
}

export const removeShoppingListItem = (shoppingListItemId) => {
    return fetch(`${_apiUrl}/shopping-list/${shoppingListItemId}`, {
        method: "DELETE"
    })
}

export const searchIngredients = async (ingredientName) => {
    return await fetch(`${_apiUrl}/search-ingredients/${ingredientName}`).then((res) => res.json());
};