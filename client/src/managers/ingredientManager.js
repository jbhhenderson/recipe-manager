const _apiUrl = "/api/ingredient";

export const getIngredientById = async (id) => {
    return await fetch(`${_apiUrl}/${id}`).then((res) => res.json());
};