const _apiUrl = "/api/recipe";

export const getRecipes = () => {
    return fetch(_apiUrl).then((res) => res.json());
};

export const getMyRecipes = (userId) => {
    return fetch(`${_apiUrl}/my-recipes/${userId}`).then((res) => res.json());
};