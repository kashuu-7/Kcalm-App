export type Meal = {
  id: string;
  name: string;
  desc: string;
  kcal: number;
  mins: number;
  p: number;
  c: number;
  f: number;
  veg: boolean;
  colors: [string, string, string]; // image area ke 3 rang (hex)
};

export type MealSlot = {
  id: string;
  time: string;
  type: string;
};

export const SLOTS: MealSlot[] = [
  { id: "breakfast", time: "08:15 AM", type: "Breakfast" },
  { id: "lunch", time: "12:45 PM", type: "Lunch" },
  { id: "pre-workout", time: "03:30 PM", type: "Pre-workout" },
  { id: "dinner", time: "07:30 PM", type: "Dinner" },
];

// Har slot ka pehla option default (current) meal hai
export const MEAL_OPTIONS: Record<string, Meal[]> = {
  breakfast: [
    {
      id: "avocado-egg",
      name: "Avocado & Poached Egg",
      desc: "Sprouted grain toast, chili flakes, microgreens",
      kcal: 510,
      mins: 10,
      p: 30,
      c: 38,
      f: 24,
      veg: true,
      colors: ["#CDE8B8", "#FFE7A3", "#E9D6B8"],
    },
    {
      id: "overnight-oats",
      name: "Overnight Oats & Berries",
      desc: "Rolled oats, chia, Greek yogurt, mixed berries",
      kcal: 485,
      mins: 5,
      p: 24,
      c: 70,
      f: 12,
      veg: true,
      colors: ["#F1E4CF", "#D9C2F2", "#FFC9D2"],
    },
    {
      id: "veggie-omelette",
      name: "Veggie Omelette & Roti",
      desc: "Three eggs, spinach, tomato, whole wheat roti",
      kcal: 565,
      mins: 12,
      p: 35,
      c: 40,
      f: 27,
      veg: true,
      colors: ["#FFE39A", "#BFE3A6", "#E8CFA8"],
    },
  ],
  lunch: [
    {
      id: "lemon-herb-chicken",
      name: "Grilled Lemon Herb Chicken",
      desc: "Tri-color quinoa, steamed broccoli, tahini lemon",
      kcal: 725,
      mins: 15,
      p: 59,
      c: 64,
      f: 19,
      veg: false,
      colors: ["#F2C27B", "#CDEBC9", "#F3EFE7"],
    },
    {
      id: "chickpea-bowl",
      name: "Lemon Chickpea Salad",
      desc: "Cucumber, tomato, red onion, feta, sumac",
      kcal: 645,
      mins: 12,
      p: 27,
      c: 70,
      f: 27,
      veg: true,
      colors: ["#F4D58D", "#B7E1A1", "#ffc9b5"],
    },
    {
      id: "tikka-wrap",
      name: "Moong Daal & Brown Rice",
      desc: "Tempered yellow lentils, cumin rice, kachumber",
      kcal: 685,
      mins: 25,
      p: 32,
      c: 105,
      f: 13,
      veg: false,
      colors: ["#f7d774", "#ede3d1", "#cdebc9"],
    },
  ],
  "pre-workout": [
    {
      id: "greek-yogurt-berries",
      name: "Greek Yogurt & Wild Berries",
      desc: "Cold whipped yogurt, roasted walnuts, honey",
      kcal: 350,
      mins: 5,
      p: 27,
      c: 32,
      f: 11,
      veg: true,
      colors: ["#F6F2EA", "#C9A7EB", "#E9C9A0"],
    },
    {
      id: "banana-toast",
      name: "Apple & Peanut Butter",
      desc: "Crisp apple slices, natural peanut butter",
      kcal: 280,
      mins: 3,
      p: 8,
      c: 35,
      f: 13,
      veg: true,
      colors: ["#FF9f8a", "#E7C48a", "#cdebc9"],
    },
    {
      id: "date-smoothie",
      name: "Roasted Spiced Chana",
      desc: "Crunchy chickpeas, chaat masala, lime",
      kcal: 255,
      mins: 20,
      p: 13,
      c: 38,
      f: 5,
      veg: true,
      colors: ["#e0a95e", "#f4d9a6", "#cdebc9"],
    },
  ],
  dinner: [
    {
      id: "miso-salmon",
      name: "Miso Glazed Wild Salmon",
      desc: "Steamed bok choy, brown jasmine rice, sesame",
      kcal: 695,
      mins: 20,
      p: 51,
      c: 43,
      f: 27,
      veg: false,
      colors: ["#F4A77E", "#BFE3A6", "#F3EFE7"],
    },
    {
      id: "chicken-karahi",
      name: "Chicken Karahi, Light",
      desc: "Tomato-ginger masala, cucumber raita, one roti",
      kcal: 820,
      mins: 25,
      p: 62,
      c: 54,
      f: 32,
      veg: false,
      colors: ["#e77e4e", "#f6f2ea", "#e8cfa8"],
    },
    {
      id: "tofu-teriyaki",
      name: "Tofu Teriyaki Bowl",
      desc: "Crispy tofu, edamame, rice, pickled carrot",
      kcal: 750,
      mins: 20,
      p: 38,
      c: 94,
      f: 21,
      veg: true,
      colors: ["#e8b96a", "#bfe3a6", "#ffb48a"],
    },
  ],
};

// Image area ka background (plate + 3 rang), card aur modal dono mein use hota hai
export function mealBackground([c1, c2, c3]: [string, string, string]) {
  return [
    `radial-gradient(circle at 36% 42%, ${c1} 0 17%, transparent 18%)`,
    `radial-gradient(circle at 62% 56%, ${c2} 0 19%, transparent 20%)`,
    `radial-gradient(circle at 58% 32%, ${c3} 0 10%, transparent 11%)`,
    `radial-gradient(circle at 42% 66%, ${c3} 0 7%, transparent 8%)`,
    `radial-gradient(circle at 50% 50%, #fff 0 40%, #ECEAE4 41% 44%, transparent 45%)`,
    `linear-gradient(135deg, ${c1}55, ${c2}55)`,
  ].join(", ");
}
