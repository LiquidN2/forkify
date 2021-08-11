import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';

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
let results = [],
  currPage = 1,
  totalPages = 1;
const perPage = 10;

// ------------------------------------------
// API & Data methods
// ------------------------------------------
const API_KEY = '5494f7e3-539e-4bc4-8a77-1eeb3dcbd82e';
const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes';

const getRecipes = pageNum => {
  return results.slice((pageNum - 1) * perPage, pageNum * perPage);
};

const fetchRecipesAsync = async name => {
  renderSpinner(resultsContainer);
  try {
    const res = await fetch(`${API_URL}?search=${name}&key=${API_KEY}`);
    const resObj = await res.json();
    return resObj.data;
  } catch (e) {
    console.error(e);
  }
};

// ------------------------------------------
// UI Updates
// ------------------------------------------
const renderRecipes = recipes => {
  const markup = recipes
    .map(recipe => {
      return `
      <li class="preview">
        <a class="preview__link" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe['image_url']}" alt="${recipe.title}" crossorigin/>
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            <div class="preview__user-generated">
              <svg><use href="${icons}#icon-user"></use></svg>
            </div>
          </div>
        </a>
      </li>
    `;
    })
    .join('');

  resultsContainer.innerHTML = '';
  resultsContainer.insertAdjacentHTML('afterbegin', markup);
};

const renderSpinner = parentEl => {
  const markup = `
    <div class="spinner">
      <svg><use href="${icons}#icon-loader"></use></svg>
    </div>`;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
  return parentEl.querySelector('.spinner');
};

const renderPagination = currPage => {
  let markup = '';
  if (currPage > 1) {
    markup += `
      <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
      </button>
    `;
  }
  if (currPage < totalPages) {
    markup += `
      <button class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  paginationContainer.innerHTML = '';
  paginationContainer.insertAdjacentHTML('afterbegin', markup);
};

// ------------------------------------------
// DOM Event Handlers
// ------------------------------------------
const displayRecipes = async formE => {
  formE.preventDefault();
  const response = await fetchRecipesAsync(inputSearch.value);
  results = response.recipes;
  currPage = 1;
  totalPages = Math.ceil(response.recipes.length / perPage);
  renderRecipes(getRecipes(currPage));
  renderPagination(currPage);
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

const handleSearchResultsClick = e => {
  const recipeEl = e.target.closest('.preview__link');
  const btnPrev = e.target.closest('.pagination__btn--prev');
  const btnNext = e.target.closest('.pagination__btn--next');

  // Handle Recipe Highlighting
  if (recipeEl) {
    resultsContainer.querySelectorAll('.preview__link').forEach(link => {
      link.classList.remove('preview__link--active');
    });
    recipeEl.classList.add('preview__link--active');
  }

  // Handle Pagination
  if (btnPrev || btnNext) {
    if (btnPrev) currPage -= 1;
    if (btnNext) currPage += 1;
    renderRecipes(getRecipes(currPage));
    renderPagination(currPage);
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

    // Render results
    resultsView.render(model.state.search.results);
  } catch (err) {}
};

// ------------------------------------------
// DOM Event Listeners
// ------------------------------------------

searchResultsContainer.addEventListener('click', handleSearchResultsClick);

(function init() {
  // Handle recipe search
  searchView.addHandlerSearch(controlSearch);

  // Handle render recipe
  recipeView.addHandlerRender(controlRecipe);
})();
