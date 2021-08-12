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
};

// --------------------------
// RECIPE
// --------------------------
export const loadRecipe = async id => {
  try {
    // Fetch data from API
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

export const nextPage = () => {
  if (state.search.currentPage === state.search.totalPages) return;
  state.search.currentPage++;
};

export const prevPage = () => {
  if (state.search.currentPage === 1) return;
  state.search.currentPage--;
};
