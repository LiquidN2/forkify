import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  constructor() {
    const containerEl = document.querySelector('.results');
    const errorMessage = 'No matching recipe. Please try another query. 🙂';
    const message = '';

    super(containerEl, errorMessage, message);
  }

  _generateMarkup() {
    return this._data.map(previewView.generateMarkup).join('');
  }
}

export default new ResultsView();
