export default class View {
  _data;

  constructor(containerEl, errorMessage = '', message = '') {
    this._containerEl = containerEl;
    this._errorMessage = errorMessage;
    this._message = message;
  }

  _clear() {
    this._containerEl.innerHTML = '';
  }

  _generateMarkup() {
    return '<span>View Content</span>';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg><use href="img/icons.svg#icon-loader"></use></svg>
      </div>
    `;

    this._clear();
    this._containerEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg><use href="img/icons.svg#icon-alert-triangle"></use></svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this._clear();
    this._containerEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg><use href="img/icons.svg#icon-smile"></use></svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();
    this._containerEl.insertAdjacentHTML('afterbegin', markup);
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._containerEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Create a virtual DOM in memory from the markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._containerEl.querySelectorAll('*'));

    // Compare the existing DOM with the virtual DOM
    for (let i = 0; i < newElements.length; i++) {
      const newEl = newElements[i],
        currEl = curElements[i];

      // Skip if the new node is the same as current node
      if (newEl.isEqualNode(currEl)) continue;

      // Update text content
      if (newEl.firstChild?.nodeValue.trim() !== '')
        currEl.textContent = newEl.textContent;

      // Update attributes
      newEl.attributes.forEach(attr =>
        currEl.setAttribute(attr.name, attr.value)
      );
    }
  }
}
