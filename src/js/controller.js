import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');
const formSearch = document.querySelector('.search');
const inputSearch = document.querySelector('.search__field');
const searchResultsContainer = document.querySelector('.search-results');
const resultsContainer = document.querySelector('.results');
const paginationContainer = document.querySelector('.pagination');

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
const showResultsandPagination = () => {
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

const controlSearch = async () => {
  try {
    resultsView.renderSpinner();

    // Get query from search form
    const query = searchView.getQuery();
    if (!query) return;

    // Fetch data from API and store in state
    await model.loadSearchResults(query);

    showResultsandPagination();
  } catch (err) {}
};

const controlPagination = actionType => {
  if (actionType === 'next') {
    model.nextPage();
  }
  if (actionType === 'prev') {
    model.prevPage();
  }

  showResultsandPagination();
};

(function init() {
  // Handle recipe search
  searchView.addHandlerSearch(controlSearch);

  // Handle pagination
  paginationView.addHandlerGoTo(controlPagination);

  // Handle render recipe
  recipeView.addHandlerRender(controlRecipe);
})();
