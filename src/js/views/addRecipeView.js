import View from './View';

class AddRecipeView extends View {
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    const containerEl = document.querySelector('.upload');
    const message = 'Recipe was successfully uploaded 🙂️';
    super(containerEl, '', message);

    this._addHandlerWindow();
  }

  _generateMarkup() {
    return `
      <div class="upload__column">
        <h3 class="upload__heading">Recipe data</h3>
        
        <label for="title">Title</label>
        <input id="title" value="${this._data.title}" required name="title" type="text" />
        
        <label for="sourceUrl">URL</label>
        <input id="sourceUrl" value="${this._data.sourceUrl}" required name="sourceUrl" type="text" />
        
        <label for="image">Image URL</label>
        <input id="image" value="${this._data.imageUrl}" required name="image" type="text" />
        
        <label for="publisher">Publisher</label>
        <input id="publisher" value="${this._data.publisher}" required name="publisher" type="text" />
        
        <label for="cookingTime">Prep time</label>
        <input id="cookingTime" value="${this._data.cookingTime}" required name="cookingTime" type="number" />
        
        <label for="servings">Servings</label>
        <input id="servings" value="${this._data.servings}" required name="servings" type="number" />
      </div>

      <div class="upload__column">
        <h3 class="upload__heading">Ingredients</h3>
      
        <label for="ingredient-1">Ingredient 1</label>
        <input id="ingredient-1" value="0.5,kg,Rice" type="text" required name="ingredient-1" placeholder="Format: 'Quantity,Unit,Description'" />
        
        <label for="ingredient-2">Ingredient 2</label>
        <input id="ingredient-2" value="1,,Avocado" type="text" name="ingredient-2" placeholder="Format: 'Quantity,Unit,Description'" />
        
        <label for="ingredient-3">Ingredient 3</label>
        <input id="ingredient-3" value=",,salt" type="text" name="ingredient-3" placeholder="Format: 'Quantity,Unit,Description'" />
        
        <label for="ingredient-4">Ingredient 4</label>
        <input id="ingredient-4" type="text" name="ingredient-4" placeholder="Format: 'Quantity,Unit,Description'" />
        
        <label for="ingredient-5">Ingredient 5</label>
        <input id="ingredient-5" type="text" name="ingredient-5" placeholder="Format: 'Quantity,Unit,Description'" />
        
        <label for="ingredient-6">Ingredient 6</label>
        <input id="ingredient-6" type="text" name="ingredient-6" placeholder="Format: 'Quantity,Unit,Description'" />
      </div>
    `;
  }

  toggleWindow() {
    ['_window', '_overlay'].forEach(el => {
      if (!this[el].classList.contains('hidden')) {
        this[el].classList.add('hidden');
      } else {
        this[el].classList.remove('hidden');
      }
    });
  }

  // Add listener to open & close modal
  _addHandlerWindow() {
    ['_btnOpen', '_btnClose'].forEach(el => {
      this[el].addEventListener('click', this.toggleWindow.bind(this));
    });
  }

  addHandlerUpload(handler) {
    this._containerEl.addEventListener('submit', e => {
      e.preventDefault();

      // Convert form data to array [['fieldName1', 'fieldValue1'], ['fieldName2', 'fieldValue2'], ...]
      const dataArray = [...new FormData(this._containerEl)];

      // Convert array to obj
      const data = Object.fromEntries(dataArray);

      handler(data);
    });
  }
}

export default new AddRecipeView();
