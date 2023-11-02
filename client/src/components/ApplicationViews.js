import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import RecipeList from "./recipes/RecipeList";
import MyRecipes from "./recipes/MyRecipes";
import RecipeDetails from "./recipes/RecipeDetails";
import PantryList from "./pantry/PantryList";
import ShoppingList from "./shopping/ShoppingList";
import MyFavoriteRecipes from "./recipes/Favorites";
import RecipeForm from "./recipes/RecipeForm";
import EditRecipe from "./recipes/EditRecipe";
import Home from "./Home";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            // consider replacing home page with carousel of recently added recipes or most popular recipes
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Home/>
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
        <Route path="create-recipe"
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <RecipeForm loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
        />
        <Route path="recipes">
          <Route
            index
            element={
              // consider replacing home page with carousel of recently added recipes or most popular recipes
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <RecipeList />
              </AuthorizedRoute>
            }
          />
          <Route path=":recipeId"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <RecipeDetails loggedInUser={loggedInUser}/>
              </AuthorizedRoute>
            }
          />
          <Route path="favorites"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <MyFavoriteRecipes loggedInUser={loggedInUser}/>
              </AuthorizedRoute>
            }
          />
          <Route path="edit/:recipeId"
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <EditRecipe loggedInUser={loggedInUser} />
              </AuthorizedRoute>
            }
          />
        </Route>
        <Route path="my-pantry">
          <Route
            index 
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <PantryList loggedInUser={loggedInUser} />
              </AuthorizedRoute>
            }
          />
        </Route>
        <Route path="my-shopping-list">
          <Route
            index 
            element={
              <AuthorizedRoute loggedInUser={loggedInUser}>
                <ShoppingList loggedInUser={loggedInUser} />
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
