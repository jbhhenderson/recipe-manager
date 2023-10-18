import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import RecipeList from "./recipes/RecipeList";
import MyRecipes from "./recipes/MyRecipes";
import RecipeDetails from "./recipes/RecipeDetails";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            // consider replacing home page with carousel of recently added recipes or most popular recipes
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <RecipeList />
            </AuthorizedRoute>
          }
        />
        <Route path="my-recipes"
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <MyRecipes loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
        />
        <Route path="recipes">
          <Route path=":recipeId"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <RecipeDetails />
              </AuthorizedRoute>
            }
          />
        </Route>
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
