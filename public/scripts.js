document.addEventListener("DOMContentLoaded", function () {
  const addRecipeForm = document.getElementById("addRecipeForm");
  const editRecipeForm = document.getElementById("editRecipeForm");

  const recipeList = document.getElementById("recipeList");

  // Function to fetch and display all recipes
  function getAllRecipes() {
      fetch("/api/recipes")
          .then(response => response.json())
          .then(recipes => {
              recipeList.innerHTML = "";
              recipes.forEach(recipe => {
                  const row = document.createElement("tr");
                  row.innerHTML = `
                      <td>${recipe.title}</td>
                      <td>${recipe.ingredients.join(", ")}</td>
                      <td>${recipe.instructions}</td>
                      <td>${recipe.cookingTime} minutes</td>
                      <td>
                          <button onclick="updateRecipe('${recipe._id}')">Update</button>
                          <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
                      </td>
                  `;
                  recipeList.appendChild(row);
              });
          })
          .catch(error => console.error("Error fetching recipes:", error));
  }

  // Function to handle form submission for adding a new recipe
  addRecipeForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(addRecipeForm);
      const newRecipe = {};
      formData.forEach((value, key) => {
          newRecipe[key] = value;
      });
      fetch("/api/recipes", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(newRecipe)
      })
          .then(response => {
              if (response.ok) {
                  return response.json();
              }
              throw new Error("Failed to add recipe");
          })
          .then(() => {
              addRecipeForm.reset();
              getAllRecipes();
          })
          .catch(error => console.error("Error adding recipe:", error));
  });

  // The Function to handle form submission for updating a recipe
editRecipeForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(editRecipeForm);
  const updatedRecipe = {};
  formData.forEach((value, key) => {
      updatedRecipe[key] = value;
  });
  const recipeId = formData.get('recipeId');
  fetch(`/api/recipes/by-id/${recipeId}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedRecipe)
  })
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error("Failed to update recipe");
      })
      .then(() => {
          editRecipeForm.reset();
          getAllRecipes();
      })
      .catch(error => console.error("Error updating recipe:", error));
});


  window.deleteRecipe = function (id) {
      if (confirm("Are you sure you want to delete this recipe?")) {
          fetch(`/api/recipes/${id}`, {
              method: "DELETE"
          })
              .then(response => {
                  if (response.ok) {
                      getAllRecipes();
                  } else {
                      throw new Error("Failed to delete recipe");
                  }
              })
              .catch(error => console.error("Error deleting recipe:", error));
      }
  };

  // Function to populate the update form with the selected recipe's data
  window.updateRecipe = function (id) {
      fetch(`/api/recipes/by-id/${id}`)
          .then(response => response.json())
          .then(recipe => {
              const editForm = document.getElementById("editRecipeForm");
              editForm.querySelector("#recipeId").value = recipe._id;
              editForm.querySelector("#title").value = recipe.title;
              editForm.querySelector("#ingredients").value = recipe.ingredients.join("\n");
              editForm.querySelector("#instructions").value = recipe.instructions;
              editForm.querySelector("#cookingTime").value = recipe.cookingTime;
          })
          .catch(error => console.error("Error fetching recipe for update:", error));
  };

  getAllRecipes();
});
