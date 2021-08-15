import View from './View';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  constructor() {
    super();
  }

  generateMarkup(recipe) {
    // Get recipe id
    const id = window.location.hash.slice(1);

    console.log(recipe.key);

    // Return markup
    return `
      <li class="preview">
        <a class="preview__link ${
          id === recipe.id ? 'preview__link--active' : ''
        }" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.imageUrl}" alt="${recipe.title}" crossorigin/>
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            ${
              recipe.key
                ? `
                <div class="preview__user-generated">
                  <svg><use href="${icons}#icon-user"></use></svg>
                </div>
              `
                : ''
            }

          </div>
        </a>
      </li>
    `;
  }
}

export default new PreviewView();
