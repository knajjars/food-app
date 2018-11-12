const express = require("express");
const router = express.Router();
const Yummly = require("ws-yummly");
const RandomizerClass = require("./recipe-randomizer");
const Random = new RandomizerClass();
const MetaData = require("./metadata");

Yummly.config({
  app_id: process.env.API_ID,
  app_key: process.env.API_KEY
});

router.post("/discover", (req, res, next) => {
  //get user preferences
  const userPref = req.user.preferences;
  const diets = userPref.diets ? userPref.diets : "";
  const cuisines =
    userPref.cuisines.length !== 0
      ? userPref.cuisines
      : Random.getRandomCuisine();
  const allergies = userPref.allergies ? userPref.allergies : "";

  //get search values for metadata
  const dietSearchValue = MetaData.getSearchValue(diets, "diet");
  const cuisineSearchValue = MetaData.getSearchValue(cuisines, "cuisine");
  const allergySearchValue = MetaData.getSearchValue(allergies, "allergy");

  Yummly.query("")
    .requirePictures(true)
    .maxResults(1)
    .allowedDiets(dietSearchValue)
    .allowedCuisines(cuisineSearchValue)
    .allowedAllergies(allergySearchValue)
    .minRating(4)
    .get()
    .then(recipes => {
      const totalMatchCount = recipes.totalMatchCount;
      const randomRecipe = Random.getRandomIndex(totalMatchCount);
      Yummly.query("")
        .requirePictures(true)
        .maxResults(1)
        .start(randomRecipe)
        .allowedDiets(dietSearchValue)
        .allowedCuisines(cuisineSearchValue)
        .allowedAllergies(allergySearchValue)
        .minRating(4)
        .get()
        .then(recipe => {
          console.log(recipe.matches[0]);
          res.render("recipes/discover", {
            recipe: recipe.matches[0],
            recipeImage: recipe.matches[0].imageUrlsBySize["90"].replace(
              "=s90-c",
              ""
            )
          });
        });
    });
});

module.exports = router;
