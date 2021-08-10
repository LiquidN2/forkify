import * as model from './model';
import recipeView from './views/recipeView';

import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');
const formSearch = document.querySelector('.search');
const inputSearch = document.querySelector('.search__field');
const searchResultsContainer = document.querySelector('.search-results');
const resultsContainer = document.querySelector('.results');
const paginationContainer = document.querySelector('.pagination');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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

const fetchRecipeAsync = async id => {
  renderSpinner(recipeContainer);
  try {
    const res = await fetch(`${API_URL}/${id}?key=${API_KEY}`);
    const resObj = await res.json();

    if (!res.ok) throw new Error(`${resObj.message} (${res.status})`);

    let { recipe } = resObj.data;

    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      cookingTime: recipe['cooking_time'],
      sourceUrl: recipe['source_url'],
      imageUrl: recipe['image_url'],
    };
    return recipe;
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

const renderRecipe = recipe => {
  const fig = `
    <figure class="recipe__fig">
      <img src="${recipe.imageUrl}" alt="Tomato" class="recipe__img" crossorigin/>
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
    </figure>
  `;

  const details = `
    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      
      <button class="btn--round">
        <svg class="">
          <use href="${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>
  `;

  const ingredients = `
    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${recipe.ingredients
          .map(ingredient => {
            return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                ${
                  ingredient.quantity
                    ? `<div class="recipe__quantity">${ingredient.quantity}</div>`
                    : ''
                }
                <div class="recipe__description">
                  <span class="recipe__unit">${ingredient.unit}</span>
                  ${ingredient.description}
                </div>
              </li>
            `;
          })
          .join('')}
      </ul>
    </div>
  `;

  const directions = `
    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a class="btn--small recipe__btn"
        href="${recipe.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;

  const markup = `
    ${fig}
    ${details}
    ${ingredients}
    ${directions}
  `;

  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', markup);
};

const renderRecipeError = () => {
  const markup = `
    <div class="error">
      <div>
        <svg><use href="${icons}#icon-alert-triangle"></use></svg>
      </div>
      <p>No recipes found for your query. Please try again!</p>
    </div>
  `;
  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', markup);
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

const displayRecipe = async () => {
  try {
    // Get recipe id
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Load spinner
    recipeView.renderSpinner();

    // Fetch recipe from id
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (e) {
    renderRecipeError();
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

// ------------------------------------------
// DOM Event Listeners
// ------------------------------------------
formSearch.addEventListener('submit', displayRecipes);

searchResultsContainer.addEventListener('click', handleSearchResultsClick);

['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, displayRecipe)
);
