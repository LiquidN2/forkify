import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
const displayResultsandPagination = () => {
  // Render results of current page
  resultsView.render(model.getSearchResultsPage());

  // Render pagination based on current page
  paginationView.render(model.state.search);
};

const controlSearch = async () => {
  try {
    resultsView.renderSpinner();

    // Get query from search form
    const query = searchView.getQuery();
    if (!query) return;

    // Fetch data from API and store in state
    await model.loadSearchResults(query);

    // Update the view (results & pagination)
    displayResultsandPagination();
  } catch (err) {}
};

const controlPagination = page => {
  model.gotoPage(page);
  displayResultsandPagination();
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
  } catch (err) {
    recipeView.renderError();
  }
};

const controlServings = servings => {
  model.updateServings(servings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

(function init() {
  // Handle recipe search
  searchView.addHandlerSearch(controlSearch);

  // Handle pagination
  paginationView.addHandlerClick(controlPagination);

  // Handle render recipe
  recipeView.addHandlerRender(controlRecipe);

  // Handle click servings
  recipeView.addHandlerClick(controlServings);
})();
