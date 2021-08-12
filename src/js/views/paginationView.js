import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  constructor() {
    const containerEl = document.querySelector('.pagination');
    super(containerEl);
  }

  _generateMarkup() {
    let markup = '';

    if (this._data.currentPage > 1) {
      const prevPage = this._data.currentPage - 1;
      markup += `
        <button class="btn--inline pagination__btn--prev" data-goto="${prevPage}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${prevPage}</span>
        </button>
      `;
    }

    if (this._data.currentPage < this._data.totalPages) {
      const nextPage = this._data.currentPage + 1;
      markup += `
        <button class="btn--inline pagination__btn--next" data-goto="${nextPage}">
          <span>Page ${nextPage}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    return markup;
  }

  addHandlerClick(handler) {
    this._containerEl.addEventListener('click', e => {
      const gotoBtn = e.target.closest('.btn--inline');
      if (!gotoBtn) return;
      handler(gotoBtn.dataset.goto);
    });
  }
}

export default new PaginationView();
