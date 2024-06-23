const express = require("express");
const { getRecipes, addRecipe, editRecipe, deleteRecipe } = require("../controllers/recipes");
const loggedIn = require("../controllers/loggedin");
const router = express.Router();

router.get("/receitas", loggedIn, getRecipes);
router.post("/receitas", loggedIn, addRecipe);
router.put("/receitas", loggedIn, editRecipe);
router.delete("/receitas", loggedIn, deleteRecipe);

module.exports = router;