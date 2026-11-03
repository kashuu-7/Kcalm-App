export type RecipeStep = { title: string; desc: string; mins: number };
export type Ingredient = { name: string; qty?: number; unit?: string };

export type Recipe = {
  videoId: string; // YouTube link mein "v=" ke baad wala hissa. Khali ho to "Watch on YouTube" card dikhta hai
  level: "Easy" | "Medium" | "Hard";
  steps: RecipeStep[];
  ingredients: Ingredient[]; // 1 serving ki miqdar
};

// Daily targets (Your daily goal match inhi se nikalta hai)
export const TARGETS = { kcal: 2280, p: 140, c: 277, f: 68 };

// Key = meal ka id (mealData.ts wala)
export const RECIPES: Record<string, Recipe> = {
  /* ---------- Breakfast ---------- */
  "avocado-egg": {
    videoId: "GxL9fTvf4go",
    level: "Easy",
    steps: [
      { title: "Toast the bread", desc: "Toast sprouted grain bread until crisp.", mins: 2 },
      { title: "Poach the eggs", desc: "Simmer water, swirl, poach eggs for 3 minutes.", mins: 3 },
      { title: "Smash avocado", desc: "Mash avocado with lemon and salt.", mins: 2 },
      { title: "Plate & serve", desc: "Top toast with avocado, eggs and chili flakes.", mins: 1 },
    ],
    ingredients: [
      { name: "Sprouted grain bread", qty: 2, unit: "slices" },
      { name: "Avocado", unit: "½" },
      { name: "Eggs", qty: 2, },
      { name: "Chili flakes", qty: 1, unit: "pinch" },
      { name: "Microgreens", qty: 1, unit: "handful" },
    ],
  },
  "overnight-oats": {
    videoId: "",
    level: "Easy",
    steps: [
      { title: "Combine base", desc: "Stir oats, chia, yogurt and milk in a jar.", mins: 1 },
      { title: "Chill overnight", desc: "Cover and refrigerate for at least 6 hours.", mins: 1 },
      { title: "Top & serve", desc: "Add berries and a drizzle of honey.", mins: 1 },
    ],
    ingredients: [
      { name: "Rolled oats", qty: 50, unit: "g" },
      { name: "Chia seeds", qty: 1, unit: "tbsp" },
      { name: "Greek yogurt", qty: 100, unit: "g" },
      { name: "Milk", qty: 120, unit: "ml" },
      { name: "Mixed berries", qty: 80, unit: "g" },
    ],
  },
  "veggie-omelette": {
    videoId: "",
    level: "Easy",
    steps: [
      { title: "Chop vegetables", desc: "Dice tomato and roughly chop spinach.", mins: 2 },
      { title: "Whisk eggs", desc: "Whisk eggs with salt and pepper.", mins: 1 },
      { title: "Cook omelette", desc: "Cook in oil, add veg, fold when set.", mins: 4 },
      { title: "Serve", desc: "Plate with warm roti.", mins: 1 },
    ],
    ingredients: [
      { name: "Eggs", qty: 3, unit: "pcs" },
      { name: "Spinach", qty: 40, unit: "g" },
      { name: "Tomato", qty: 1, },
      { name: "Whole wheat roti", qty: 1, },
      { name: "Olive oil", qty: 1, unit: "tsp" },
    ],
  },

  /* ---------- Lunch ---------- */
  "lemon-herb-chicken": {
    videoId: "",
    level: "Medium",
    steps: [
      { title: "Prepare ingredients", desc: "Wash vegetables and prepare the chicken breast.", mins: 2 },
      { title: "Season chicken", desc: "Add herbs, lemon and spices evenly.", mins: 3 },
      { title: "Cook Chicken", desc: "Grill for 6–8 minutes until golden.", mins: 6 },
      { title: "Plate & serve", desc: "Combine with quinoa and vegetables.", mins: 2 },
    ],
    ingredients: [
      { name: "Chicken breast", qty: 150, unit: "g" },
      { name: "Quinoa", qty: 60, unit: "g dry" },
      { name: "Broccoli", qty: 100, unit: "g" },
      { name: "Lemon", unit: "½" },
      { name: "Tahini", qty: 1, unit: "tbsp" },
      { name: "Fresh herbs", qty: 1, unit: "tbsp" },
    ],
  },
  "chickpea-bowl": {
    videoId: "",
    level: "Easy",
    steps: [
      { title: "Rinse chickpeas", desc: "Rinse and drain the chickpeas.", mins: 2 },
      { title: "Dice vegetables", desc: "Dice cucumber, tomato and red onion.", mins: 4 },
      { title: "Make dressing", desc: "Whisk lemon, olive oil and sumac.", mins: 3 },
      { title: "Toss & serve", desc: "Toss everything, top with feta.", mins: 3 },
    ],
    ingredients: [
      { name: "Chickpeas", qty: 1, unit: "can" },
      { name: "Cucumber", qty: 1, },
      { name: "Tomato", qty: 1, },
      { name: "Red onion", unit: "¼" },
      { name: "Feta", qty: 40, unit: "g" },
      { name: "Lemon", qty: 1, },
    ],
  },
  "tikka-wrap": {
    videoId: "",
    level: "Medium",
    steps: [
      { title: "Rinse lentils", desc: "Rinse daal until water runs clear.", mins: 2 },
      { title: "Simmer daal", desc: "Simmer with turmeric until soft.", mins: 12 },
      { title: "Tempering", desc: "Sizzle cumin, garlic and onion in oil.", mins: 2 },
      { title: "Serve", desc: "Pour tadka over daal, serve with rice.", mins: 1 },
    ],
    ingredients: [
      { name: "Moong daal", qty: 70, unit: "g" },
      { name: "Brown rice", qty: 60, unit: "g" },
      { name: "Onion", unit: "½" },
      { name: "Garlic", qty: 2, unit: "cloves" },
      { name: "Cumin seeds", qty: 1, unit: "tsp" },
    ],
  },

  /* ---------- Pre-workout ---------- */
  "greek-yogurt-berries": {
    videoId: "",
    level: "Easy",
    steps: [
      { title: "Whip yogurt", desc: "Whisk yogurt until light and smooth.", mins: 1 },
      { title: "Top & serve", desc: "Add berries, walnuts and honey.", mins: 1 },
    ],
    ingredients: [
      { name: "Greek yogurt", qty: 170, unit: "g" },
      { name: "Wild berries", qty: 60, unit: "g" },
      { name: "Walnuts", qty: 10, unit: "g" },
      { name: "Honey", qty: 1, unit: "tsp" },
    ],
  },
  "banana-toast": {
    videoId: "",
    level: "Easy",
    steps: [
      { title: "Slice apple", desc: "Core and slice the apple.", mins: 1 },
      { title: "Serve", desc: "Serve with peanut butter for dipping.", mins: 1 },
    ],
    ingredients: [
      { name: "Apple", qty: 1, },
      { name: "Peanut butter", qty: 1, unit: "tbsp" },
    ],
  },
  "date-smoothie": {
    videoId: "",
    level: "Easy",
    steps: [
      { title: "Dry chickpeas", desc: "Pat chickpeas dry.", mins: 1 },
      { title: "Season", desc: "Toss with oil and chaat masala.", mins: 1 },
      { title: "Air fry", desc: "Air fry 15 minutes until crunchy.", mins: 15 },
      { title: "Serve", desc: "Squeeze lime and serve.", mins: 1 },
    ],
    ingredients: [
      { name: "Chickpeas", qty: 1, unit: "can" },
      { name: "Chaat masala", qty: 1, unit: "tbsp" },
      { name: "Lime", unit: "½" },
    ],
  },

  /* ---------- Dinner ---------- */
  "miso-salmon": {
    videoId: "",
    level: "Medium",
    steps: [
      { title: "Make glaze", desc: "Mix miso, honey and rice vinegar.", mins: 1 },
      { title: "Glaze salmon", desc: "Brush glaze over the salmon.", mins: 1 },
      { title: "Bake salmon", desc: "Bake at 200°C for 12 minutes.", mins: 12 },
      { title: "Plate & serve", desc: "Serve with bok choy and rice.", mins: 2 },
    ],
    ingredients: [
      { name: "Salmon fillet", qty: 140, unit: "g" },
      { name: "White miso", qty: 1, unit: "tbsp" },
      { name: "Bok choy", qty: 100, unit: "head" },
      { name: "Brown jasmine rice ", qty: 50, unit: "g" },
      { name: "Sesame seeds", qty: 1, unit: "tsp" },
    ],
  },
  "tofu-teriyaki": {
    videoId: "",
    level: "Medium",
    steps: [
      { title: "Prep masala", desc: "Chop tomatoes, ginger and chili.", mins: 3 },
      { title: "Sear chicken", desc: "Sear chicken in a hot karahi.", mins: 5 },
      { title: "Simmer", desc: "Add tomatoes and cook down.", mins: 10 },
      { title: "Finish & serve", desc: "Top with ginger, serve with raita.", mins: 2 },
    ],
    ingredients: [
      { name: "Chicken thigh", qty: 160, unit: "g" },
      { name: "Tomatoes", qty: 2,},
      { name: "Ginger", qty: 1, unit: "inch" },
      { name: "Green chili", qty: 1, },
      { name: "Yogurt", qty: 60, unit: "g" },
      { name: "Roti", qty: 1, },
    ],
  },
  "chicken-karahi": {
    videoId: "",
    level: "Medium",
    steps: [
      { title: "Press & cube tofu", desc: "Press tofu and cut into cubes.", mins: 2 },
      { title: "Crisp tofu", desc: "Pan-fry until golden on all sides.", mins: 8 },
      { title: "Glaze", desc: "Toss with teriyaki sauce.", mins: 1 },
      { title: "Build bowl", desc: "Assemble with rice and toppings.", mins: 2 },
    ],
    ingredients: [
      { name: "Firm tofu", qty: 150, unit: "g" },
      { name: "Edamame", qty: 60, unit: "g" },
      { name: "Rice", qty: 60, unit: "g" },
      { name: "Carrot", qty: 1, },
      { name: "Teriyaki sauce", qty: 2, unit: "tbsp" },
    ],
  },
};

const EMPTY_RECIPE: Recipe = {
  videoId: "",
  level: "Easy",
  steps: [],
  ingredients: [],
};

export function getRecipe(mealId: string): Recipe {
  return RECIPES[mealId] ?? EMPTY_RECIPE;
}
