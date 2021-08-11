class SearchView {
  _containerEl = document.querySelector('.search');

  _clearInput() {
    this._containerEl.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this._containerEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  addHandlerSearch(handler) {
    this._containerEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
