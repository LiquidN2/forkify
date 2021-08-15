import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config';
import { getJSON, sendJSON } from './helpers';

// --------------------------
// APPLICATION STATE
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
  upload: {},
};

// --------------------------
// RECIPE
// --------------------------
const createRecipeObj = resObj => {
  // Store recipe in state
  let { recipe } = resObj.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    cookingTime: recipe['cooking_time'],
    sourceUrl: recipe['source_url'],
    imageUrl: recipe['image_url'],
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async id => {
  try {
    // If recipe not in bookmarks, fetch data from API
    const resObj = await getJSON(`${API_URL}/${id}?key=${API_KEY}`);

    // Store recipe in state
    state.recipe = createRecipeObj(resObj);

    // Check if recipe is bookmarked
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
  } catch (err) {
    throw err;
  }
};

// --------------------------
// RECIPE SERVINGS
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
// RECIPE BOOKMARKING
// --------------------------
const persistBookmarks = () =>
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

export const clearBookmarks = () => {
  localStorage.removeItem('bookmarks');
  state.bookmarks = [];
  state.recipe.bookmarked = false;
};

export const addBookmark = recipe => {
  if (recipe.bookmarked) return;

  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

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

  persistBookmarks();
};

const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// --------------------------
// RECIPE UPLOAD
// --------------------------
export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(([key, value]) => (key.startsWith('ingredient') ? value : null))
      .map(([_, value]) => {
        const ingredientsArray = value.split(',');

        if (ingredientsArray.length !== 3)
          throw new Error('Please use the correct ingredient format');

        const [quantity, unit, description] = ingredientsArray.map(el =>
          el.trim()
        );

        return {
          quantity: +quantity || null,
          unit: unit || null,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      servings: +newRecipe.servings,
      publisher: newRecipe.publisher,
      ingredients,
    };

    recipe['image_url'] = newRecipe.image;
    recipe['cooking_time'] = +newRecipe.cookingTime;
    recipe['source_url'] = newRecipe.sourceUrl;

    const resObj = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObj(resObj);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
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
// SEARCH RESULTS PAGINATION
// --------------------------
export const getSearchResultsPage = (page = state.search.currentPage) => {
  return state.search.results.slice(
    (page - 1) * RESULTS_PER_PAGE,
    page * RESULTS_PER_PAGE
  );
};

export const gotoPage = page => (state.search.currentPage = +page);
