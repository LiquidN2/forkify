import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  constructor() {
    const containerEl = document.querySelector('.pagination');
    super(containerEl);
  }

  _generateMarkup() {
    let markup = '';
    if (this._data.search.currentPage > 1) {
      markup += `
      <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.search.currentPage - 1}</span>
      </button>
    `;
    }
    if (this._data.search.currentPage < this._data.search.totalPages) {
      markup += `
      <button class="btn--inline pagination__btn--next">
        <span>Page ${this._data.search.currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
    }

    return markup;
  }

  addHandlerGoTo(handler) {
    this._containerEl.addEventListener('click', e => {
      const btnNext = e.target.closest('.pagination__btn--next');
      const btnPrev = e.target.closest('.pagination__btn--prev');
      if (!btnPrev && !btnNext) return;
      if (btnPrev) return handler('prev');
      if (btnNext) handler('next');
    });
  }
}

export default new PaginationView();
