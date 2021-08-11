class SearchView {
  #containerEl = document.querySelector('.search');

  #clearInput() {
    this.#containerEl.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this.#containerEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  addHandlerSearch(handler) {
    this.#containerEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
