const _apiUrl = "/api/ingredient";

export const getIngredientById = async (id) => {
    return await fetch(`${_apiUrl}/${id}`).then((res) => res.json());
};

export const getPantryIngredientsByUserId = async (userId) => {
    return await fetch(`${_apiUrl}/pantry/${userId}`).then((res) => res.json());
};