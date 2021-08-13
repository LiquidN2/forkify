import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config';
import { getJSON } from './helpers';

// --------------------------
// Application State
// --------------------------
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
    totalPages: 1,
  },
  bookmarks: [],
};

// --------------------------
// RECIPE
// --------------------------
export const loadRecipe = async id => {
  try {
    // If recipe not in bookmarks, fetch data from API
    const resObj = await getJSON(`${API_URL}/${id}?key=${API_KEY}`);

    // Store recipe in state
    let { recipe } = resObj.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      cookingTime: recipe['cooking_time'],
      sourceUrl: recipe['source_url'],
      imageUrl: recipe['image_url'],
    };

    // Check if recipe is bookmarked
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
  } catch (err) {
    throw err;
  }
};

// --------------------------
// SERVING
// --------------------------
export const updateServings = servings => {
  if (servings === 0) return;

  state.recipe.ingredients = state.recipe.ingredients.map(ingredient => {
    if (!ingredient.quantity) return ingredient;
    return {
      description: ingredient.description,
      unit: ingredient.unit,
      quantity: (ingredient.quantity / state.recipe.servings) * servings,
    };
  });
  state.recipe.servings = servings;
};

// --------------------------
// SEARCH
// --------------------------
export const loadSearchResults = async query => {
  try {
    // Stores query in state
    state.search.query = query;

    // Fetch data from API
    const resObj = await getJSON(
      `${API_URL}?search=${state.search.query}&key=${API_KEY}`
    );

    // Store search results in state
    state.search.results = resObj.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        imageUrl: recipe['image_url'],
      };
    });

    // Store total number of pages in state
    state.search.totalPages = Math.ceil(
      state.search.results.length / RESULTS_PER_PAGE
    );

    // Reset current page in state
    state.search.currentPage = 1;
  } catch (err) {
    throw err;
  }
};

// --------------------------
// PAGINATION
// --------------------------
export const getSearchResultsPage = (page = state.search.currentPage) => {
  return state.search.results.slice(
    (page - 1) * RESULTS_PER_PAGE,
    page * RESULTS_PER_PAGE
  );
};

export const gotoPage = page => (state.search.currentPage = +page);

// --------------------------
// BOOKMARK
// --------------------------
// export const addBookmark = recipe => {
//   if (recipe.bookmarked) return;
//
//   // Add recipe to bookmarks
//   state.bookmarks.push(recipe);
//
//   // Mark the current recipe as bookmarked
//   if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
// };
//
// export const removeBookmark = recipe => {
//   if (!recipe.bookmarked) return;
//
//   // Remove recipe from state
//   const recipeIndex = state.bookmarks.findIndex(
//     bookmark => bookmark.id === recipe.id
//   );
//   state.bookmarks.copyWithin(recipeIndex, recipeIndex + 1);
//   --state.bookmarks.length;
//
//   if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
// };

export const toggleBookmark = recipe => {
  // Add recipe if not bookmarked
  if (!recipe.bookmarked) {
    state.bookmarks.push(recipe);
  } else {
    const recipeIndex = state.bookmarks.findIndex(
      bookmark => bookmark.id === recipe.id
    );
    state.bookmarks.copyWithin(recipeIndex, recipeIndex + 1);
    --state.bookmarks.length;
  }

  if (recipe.id === state.recipe.id)
    state.recipe.bookmarked = !state.recipe.bookmarked;
};
