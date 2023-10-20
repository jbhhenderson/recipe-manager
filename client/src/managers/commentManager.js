const _apiUrl = "/api/comment"

export const getRecipeComments = (recipeId) => {
    return fetch(`${_apiUrl}/${recipeId}`).then((res) => res.json());
};

export const createComment = (comment) => {
    return fetch(_apiUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(comment)
    }).then((res) => res.json())
}