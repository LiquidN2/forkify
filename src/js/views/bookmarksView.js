import View from './View';
import previewView from './previewView';

class BookmarksView extends View {
  constructor() {
    const containerEl = document.querySelector('.bookmarks__list');
    const errorMessage =
      'No bookmarks yet. Find a nice recipe and bookmark it 🙂';
    const message = '';
    super(containerEl, errorMessage, message);
  }

  _generateMarkup() {
    return this._data.map(previewView.generateMarkup).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
