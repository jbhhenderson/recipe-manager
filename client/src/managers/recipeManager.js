const _apiUrl = "/api/recipe";

export const getRecipes = () => {
    return fetch(_apiUrl).then((res) => res.json());
};

export const getMyRecipes = (userId) => {
    return fetch(`${_apiUrl}/my-recipes/${userId}`).then((res) => res.json());
};

export const getMyFavoriteRecipes = (userId) => {
    return fetch(`${_apiUrl}/favorites/${userId}`).then((res) => res.json());
};

export const getRecipeById = async (id) => {
    return await fetch(`${_apiUrl}/${id}`).then((res) => res.json());
};

export const createRecipe = (recipe) => {
    return fetch(`${_apiUrl}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(recipe)
    }).then((res) => res.json())
};

export const deleteRecipe = (recipeId) => {
    return fetch(`${_apiUrl}/${recipeId}`, {
        method: "DELETE"
    })
};

export const updateRecipe = (recipe) => {
    return fetch(`${_apiUrl}/${recipe.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(recipe)
    })
};

export const createRecipeIngredient = (recipeIngredient) => {
    return fetch(`${_apiUrl}/recipe-ingredient`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(recipeIngredient)
    }).then((res) => res.json())
};

export const addFavorite = (userId, recipeId) => {
    return fetch(`${_apiUrl}/user/${userId}/favorite/recipe/${recipeId}`, {
        method: "POST"
    }).then((res) => res.json())
}

export const removeFavorite = (userId, recipeId) => {
    return fetch(`${_apiUrl}/user/${userId}/favorite/recipe/${recipeId}`, {
        method: "DELETE"
    })
}

export const getFavoriteStatus = (userId, recipeId) => {
    return fetch(`${_apiUrl}/user/${userId}/recipe/${recipeId}/is-favorite`).then((res) => res.json())
}