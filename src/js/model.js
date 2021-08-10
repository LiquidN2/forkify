export const state = {
  recipe: {},
};

const API_KEY = '5494f7e3-539e-4bc4-8a77-1eeb3dcbd82e';
const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes';

export const loadRecipe = async id => {
  try {
    const res = await fetch(`${API_URL}/${id}?key=${API_KEY}`);
    const resObj = await res.json();

    if (!res.ok) throw new Error(`${resObj.message} (${res.status})`);

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
    alert(e);
  }
};
