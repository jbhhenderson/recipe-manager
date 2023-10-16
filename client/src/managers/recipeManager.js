const _apiUrl = "/api/recipe";

export const getRecipes = () => {
    return fetch(_apiUrl).then((res) => res.json());
};