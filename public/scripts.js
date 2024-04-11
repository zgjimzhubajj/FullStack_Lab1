document.addEventListener("DOMContentLoaded", function () {
    const addRecipeForm = document.getElementById("addRecipeForm");
    const recipeList = document.getElementById("recipeList");
  
    // This is the function to fetch and display all recipes
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
  
    // This is the other function to handle form submission for adding a new recipe
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
          getAllRecipes(); // We use this to show the new recipe
        })
        .catch(error => console.error("Error adding recipe:", error));
    });
  
    window.updateRecipe = function (title) {
        fetch(`/api/recipes?title=${encodeURIComponent(title)}`)
            .then(response => response.json())
            .then(recipe => {
                // Here you can populate a form with the recipe data for editing
            document.getElementById("title").value = recipe.title;
            document.getElementById("ingredients").value = recipe.ingredients;
            document.getElementById("instructions").value = recipe.instructions;
            document.getElementById("cookingTime").value = recipe.cookingTime;
            })
            .catch(error => console.error("Error fetching recipe for editing:", error));
    };
  
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
  
    getAllRecipes();
  });
  


