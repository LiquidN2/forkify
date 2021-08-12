import View from './View';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView extends View {
  constructor() {
    const containerEl = document.querySelector('.recipe');
    const errorMessage = 'Recipe not found. Please try another one';
    const message =
      'Start by searching for a recipe or an ingredient. Have fun!';

    super(containerEl, errorMessage, message);
  }

  _generateMarkupIngredient(ingredient) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon"><use href="${icons}#icon-check"></use></svg>
        ${
          ingredient.quantity
            ? `<div class="recipe__quantity">
            ${new Fraction(ingredient.quantity).toString()}
            </div>`
            : ''
        }
        <div class="recipe__description">
          <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.description}
        </div>
      </li>
    `;
  }

  _generateMarkup() {
    const fig = `
      <figure class="recipe__fig">
        <img src="${this._data.imageUrl}" alt="Tomato" class="recipe__img" crossorigin/>
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>
    `;

    const details = `
      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings">
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
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
        </ul>
      </div>
    `;

    const directions = `
      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;

    return `${fig}${details}${ingredients}${directions}`;
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerClick(handler) {
    this._containerEl.addEventListener('click', e => {
      const btnIncServings = e.target.closest('.btn--increase-servings');
      const btnDecServings = e.target.closest('.btn--decrease-servings');
      if (btnIncServings) return handler('inc');
      if (btnDecServings) handler('dec');
    });
  }
}

export default new RecipeView();
