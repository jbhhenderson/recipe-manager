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

export const getShoppingListIngredientsByUserId = async (userId) => {
    return await fetch(`${_apiUrl}/shopping-list/${userId}`).then((res) => res.json());
};

export const searchIngredients = async (ingredientName) => {
    return await fetch(`${_apiUrl}/search-ingredients/${ingredientName}`).then((res) => res.json());
};