import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import paginationView from './views/paginationView';

import { MODAL_CLOSE_SEC } from './config';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlSearch = async () => {
  try {
    resultsView.renderSpinner();

    // Get query from search form
    const query = searchView.getQuery();
    if (!query) return;

    // Fetch data from API and store in state
    await model.loadSearchResults(query);

    // Render results of current page
    resultsView.render(model.getSearchResultsPage());

    // Render pagination based on current page
    paginationView.render(model.state.search);
  } catch (err) {}
};

const controlPagination = page => {
  model.gotoPage(page);

  // Render results of current page
  resultsView.render(model.getSearchResultsPage());

  // Render pagination based on current page
  paginationView.render(model.state.search);
};

const controlRecipe = async () => {
  try {
    // Get recipe id
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Update results view to highlight selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Load spinner
    recipeView.renderSpinner();

    // Fetch recipe from id and store in state
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlServings = servings => {
  model.updateServings(servings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmark = () => {
  // Toggle bookmark status in state
  model.toggleBookmark(model.state.recipe);

  // Update bookmark status in view
  recipeView.update(model.state.recipe);

  // Render bookmarks preview
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload recipe to API
    await model.uploadRecipe(newRecipe);

    // Render recipe in view
    recipeView.render(model.state.recipe);

    // Render success message
    addRecipeView.renderMessage();

    // Close modal
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

(function init() {
  // Render bookmarks saved in localStorage
  bookmarksView.addHandlerRender(controlBookmarks);

  // Handle recipe search
  searchView.addHandlerSearch(controlSearch);

  // Handle pagination
  paginationView.addHandlerClick(controlPagination);

  // Handle render recipe
  recipeView.addHandlerRender(controlRecipe);

  // Handle click servings
  recipeView.addHandlerUpdateServings(controlServings);

  // Handle click bookmark
  recipeView.addHandlerAddBookmark(controlBookmark);

  addRecipeView.addHandlerUpload(controlAddRecipe);
})();
