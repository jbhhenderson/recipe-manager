import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import RecipeList from "./recipes/RecipeList";
import MyRecipes from "./recipes/MyRecipes";
import RecipeDetails from "./recipes/RecipeDetails";
import PantryList from "./pantry/PantryList";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            // consider replacing home page with carousel of recently added recipes or most popular recipes
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.popsugar-assets.com%2Ffiles%2Fthumbor%2FDcp42VJu_GJnsiFeYYrY1a7p7Bc%2Ffit-in%2F2048xorig%2Ffilters%3Aformat_auto-!!-%3Astrip_icc-!!-%2F2019%2F05%2F10%2F729%2Fn%2F44492010%2Ftmp_ZFwZZ3_2d3bfc3b6b6e3e81_GettyImages-471021124.jpg&f=1&nofb=1&ipt=6deaca37f6a0671996adbe12061134e66f0121e600a99c5c336e195ca86b5056&ipo=images"></img>
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
                <RecipeDetails />
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
