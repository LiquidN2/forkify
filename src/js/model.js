import { API_KEY, API_URL } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

export const loadRecipe = async id => {
  try {
    const resObj = await getJSON(`${API_URL}/${id}?key=${API_KEY}`);

    let { recipe } = resObj.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      cookingTime: recipe['cooking_time'],
      sourceUrl: recipe['source_url'],
      imageUrl: recipe['image_url'],
    };
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const resObj = await getJSON(
      `${API_URL}?search=${state.search.query}&key=${API_KEY}`
    );

    state.search.results = resObj.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        imageUrl: recipe['image_url'],
      };
    });

    console.log(state.search);
  } catch (err) {
    throw err;
  }
};
