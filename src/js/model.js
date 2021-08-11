import { API_KEY, API_URL } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
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
  } catch (e) {
    console.error(e);
  }
};
