import View from './View';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  constructor() {
    const containerEl = document.querySelector('.results');
    const errorMessage = 'No matching recipe. Please try another.';
    const message = '';

    super(containerEl, errorMessage, message);
  }

  _generateMarkupPreview(recipe) {
    return `
      <li class="preview">
        <a class="preview__link" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.imageUrl}" alt="${recipe.title}" crossorigin/>
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
  }

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  addHandlerRender(handler) {}
}

export default new ResultsView();
