import View from './View';

class AddRecipeView extends View {
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    const containerEl = document.querySelector('.upload');
    super(containerEl);

    this._addHandlerWindow();
  }

  _generateMarkup() {}

  _toggleWindow() {
    ['_window', '_overlay'].forEach(el => {
      if (!this[el].classList.contains('hidden')) {
        this[el].classList.add('hidden');
      } else {
        this[el].classList.remove('hidden');
      }
    });
  }

  _addHandlerWindow() {
    ['_btnOpen', '_btnClose'].forEach(el => {
      this[el].addEventListener('click', this._toggleWindow.bind(this));
    });
  }
}

export default new AddRecipeView();
