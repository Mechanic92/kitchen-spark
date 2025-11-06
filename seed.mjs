import { drizzle } from "drizzle-orm/mysql2";
import { recipes, supermarketProducts } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const sampleRecipes = [
  {
    name: "Gourmet Seafood Bouillabaisse",
    description: "A luxurious French seafood stew with lobster, mussels, and fresh fish in a saffron-infused broth. Perfect for special occasions.",
    imageUrl: "/images/recipes/9Yix6caOtI98.jpg",
    youtubeVideoId: "JBHyxEAh4Ek",
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: "hard",
    category: "Seafood",
    cuisine: "French",
    rating: 48,
    ingredients: JSON.stringify([
      "500g mixed seafood (lobster, mussels, fish)",
      "2 onions, diced",
      "4 garlic cloves, minced",
      "1 fennel bulb, sliced",
      "400g tomatoes, chopped",
      "1L fish stock",
      "Pinch of saffron",
      "Fresh herbs (thyme, parsley)",
      "Olive oil",
      "Salt and pepper"
    ]),
    instructions: JSON.stringify([
      "Sauté onions, garlic, and fennel in olive oil until soft",
      "Add tomatoes and cook for 5 minutes",
      "Pour in fish stock and add saffron, bring to boil",
      "Add firm fish first, simmer for 5 minutes",
      "Add shellfish and cook until opened",
      "Season with salt, pepper, and fresh herbs",
      "Serve hot with crusty bread"
    ]),
    nutritionInfo: JSON.stringify({
      calories: 380,
      protein: 42,
      carbs: 18,
      fat: 15
    }),
    tags: JSON.stringify(["seafood", "french", "gourmet", "special-occasion"])
  },
  {
    name: "Artisan Flatbread with Roasted Vegetables",
    description: "Homemade flatbread topped with colorful roasted vegetables and herbs. A healthy and delicious meal.",
    imageUrl: "/images/recipes/WfIEBhshj7xO.jpg",
    youtubeVideoId: "W7RzPCQBjBY",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: "medium",
    category: "Vegetarian",
    cuisine: "Mediterranean",
    rating: 46,
    ingredients: JSON.stringify([
      "2 cups flour",
      "1 tsp yeast",
      "1 cup warm water",
      "2 tbsp olive oil",
      "Mixed vegetables (tomatoes, zucchini, peppers)",
      "Fresh herbs",
      "Salt"
    ]),
    instructions: JSON.stringify([
      "Mix flour, yeast, water, and salt to form dough",
      "Knead for 10 minutes, let rise for 1 hour",
      "Roll out dough into flatbreads",
      "Roast vegetables with olive oil and herbs",
      "Top flatbreads with vegetables",
      "Bake at 220°C for 12-15 minutes",
      "Garnish with fresh herbs"
    ]),
    nutritionInfo: JSON.stringify({
      calories: 320,
      protein: 10,
      carbs: 52,
      fat: 8
    }),
    tags: JSON.stringify(["vegetarian", "healthy", "mediterranean", "bread"])
  },
  {
    name: "Rustic Pasta Rigatoni",
    description: "Hearty pasta with a rich tomato sauce, fresh basil, and parmesan. Comfort food at its finest.",
    imageUrl: "/images/recipes/aCUiDue4nv2L.jpg",
    youtubeVideoId: "UhEpCbAXDWM",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    category: "Pasta",
    cuisine: "Italian",
    rating: 47,
    ingredients: JSON.stringify([
      "400g rigatoni pasta",
      "800g canned tomatoes",
      "4 garlic cloves",
      "Fresh basil",
      "Parmesan cheese",
      "Olive oil",
      "Salt and pepper",
      "Chili flakes (optional)"
    ]),
    instructions: JSON.stringify([
      "Cook pasta according to package directions",
      "Sauté garlic in olive oil until fragrant",
      "Add tomatoes and simmer for 15 minutes",
      "Season with salt, pepper, and chili flakes",
      "Toss cooked pasta with sauce",
      "Top with fresh basil and parmesan",
      "Serve immediately"
    ]),
    nutritionInfo: JSON.stringify({
      calories: 420,
      protein: 14,
      carbs: 68,
      fat: 10
    }),
    tags: JSON.stringify(["pasta", "italian", "comfort-food", "quick"])
  },
  {
    name: "Gnocchi in Tomato Cream Sauce",
    description: "Pillowy soft gnocchi in a rich tomato cream sauce with fresh basil. A restaurant favorite you can make at home.",
    imageUrl: "/images/recipes/NJ6oUiU8DBXU.jpg",
    youtubeVideoId: "1XEfqIvDqYo",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "medium",
    category: "Pasta",
    cuisine: "Italian",
    rating: 49,
    ingredients: JSON.stringify([
      "800g fresh gnocchi",
      "400g canned tomatoes",
      "200ml heavy cream",
      "3 garlic cloves",
      "Fresh basil",
      "Mozzarella cheese",
      "Parmesan cheese",
      "Olive oil",
      "Salt and pepper"
    ]),
    instructions: JSON.stringify([
      "Cook gnocchi according to package directions",
      "Sauté garlic in olive oil",
      "Add tomatoes and simmer for 10 minutes",
      "Stir in cream and season",
      "Add cooked gnocchi to sauce",
      "Top with mozzarella and parmesan",
      "Broil until cheese is melted and golden",
      "Garnish with fresh basil"
    ]),
    nutritionInfo: JSON.stringify({
      calories: 520,
      protein: 18,
      carbs: 62,
      fat: 22
    }),
    tags: JSON.stringify(["pasta", "italian", "comfort-food", "cheese"])
  },
  {
    name: "Pan-Seared Salmon with Vegetables",
    description: "Perfectly cooked salmon fillet with colorful roasted vegetables. Healthy and delicious.",
    imageUrl: "/images/recipes/ihvShCSQ1356.jpg",
    youtubeVideoId: "zBqzcBaHXmY",
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: "medium",
    category: "Seafood",
    cuisine: "Contemporary",
    rating: 46,
    ingredients: JSON.stringify([
      "2 salmon fillets",
      "Mixed vegetables (carrots, broccoli, peppers)",
      "Lemon",
      "Olive oil",
      "Garlic",
      "Fresh herbs",
      "Salt and pepper"
    ]),
    instructions: JSON.stringify([
      "Season salmon with salt, pepper, and lemon juice",
      "Chop vegetables into bite-sized pieces",
      "Roast vegetables at 200°C for 15 minutes",
      "Heat oil in pan over medium-high heat",
      "Sear salmon skin-side down for 4 minutes",
      "Flip and cook for another 3-4 minutes",
      "Serve with roasted vegetables and lemon wedges"
    ]),
    nutritionInfo: JSON.stringify({
      calories: 380,
      protein: 34,
      carbs: 18,
      fat: 20
    }),
    tags: JSON.stringify(["seafood", "healthy", "protein", "omega-3"])
  },
  {
    name: "Classic Margherita Pizza",
    description: "Traditional Italian pizza with fresh mozzarella, basil, and tomato sauce. Simple perfection.",
    imageUrl: "/images/recipes/Obr8ir8R3DzS.jpg",
    youtubeVideoId: "1-SJGQ2HLp8",
    prepTime: 90,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    category: "Pizza",
    cuisine: "Italian",
    rating: 48,
    ingredients: JSON.stringify([
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella",
      "Fresh basil",
      "Olive oil",
      "Salt"
    ]),
    instructions: JSON.stringify([
      "Preheat oven to 250°C",
      "Roll out pizza dough",
      "Spread tomato sauce evenly",
      "Add torn mozzarella pieces",
      "Drizzle with olive oil",
      "Bake for 12-15 minutes",
      "Top with fresh basil leaves"
    ]),
    nutritionInfo: JSON.stringify({
      calories: 280,
      protein: 12,
      carbs: 35,
      fat: 10
    }),
    tags: JSON.stringify(["pizza", "italian", "classic", "vegetarian"])
  }
];

const supermarketProductsData = [
  // Countdown
  { name: "Fresh Bananas", supermarket: "Countdown", price: 365, unit: "kg", category: "Fruit", country: "NZ" },
  { name: "Broccoli Crown", supermarket: "Countdown", price: 230, unit: "ea", category: "Vegetables", country: "NZ" },
  { name: "Cherry Tomatoes 250g", supermarket: "Countdown", price: 450, unit: "pack", category: "Vegetables", country: "NZ" },
  { name: "Fresh Salmon Fillet", supermarket: "Countdown", price: 2999, unit: "kg", category: "Seafood", country: "NZ" },
  { name: "Rigatoni Pasta 500g", supermarket: "Countdown", price: 299, unit: "pack", category: "Pantry", country: "NZ" },
  { name: "Fresh Mozzarella", supermarket: "Countdown", price: 599, unit: "pack", category: "Dairy", country: "NZ" },
  { name: "Olive Oil 500ml", supermarket: "Countdown", price: 899, unit: "bottle", category: "Pantry", country: "NZ" },
  
  // New World
  { name: "Fresh Bananas", supermarket: "New World", price: 420, unit: "kg", category: "Fruit", country: "NZ" },
  { name: "Broccoli Crown", supermarket: "New World", price: 250, unit: "ea", category: "Vegetables", country: "NZ" },
  { name: "Cherry Tomatoes 250g", supermarket: "New World", price: 499, unit: "pack", category: "Vegetables", country: "NZ" },
  { name: "Fresh Salmon Fillet", supermarket: "New World", price: 3299, unit: "kg", category: "Seafood", country: "NZ" },
  { name: "Rigatoni Pasta 500g", supermarket: "New World", price: 329, unit: "pack", category: "Pantry", country: "NZ" },
  { name: "Fresh Mozzarella", supermarket: "New World", price: 649, unit: "pack", category: "Dairy", country: "NZ" },
  { name: "Olive Oil 500ml", supermarket: "New World", price: 949, unit: "bottle", category: "Pantry", country: "NZ" },
  
  // Pak'nSave
  { name: "Fresh Bananas", supermarket: "Pak'nSave", price: 345, unit: "kg", category: "Fruit", country: "NZ" },
  { name: "Broccoli Crown", supermarket: "Pak'nSave", price: 199, unit: "ea", category: "Vegetables", country: "NZ" },
  { name: "Cherry Tomatoes 250g", supermarket: "Pak'nSave", price: 399, unit: "pack", category: "Vegetables", country: "NZ" },
  { name: "Fresh Salmon Fillet", supermarket: "Pak'nSave", price: 2799, unit: "kg", category: "Seafood", country: "NZ" },
  { name: "Rigatoni Pasta 500g", supermarket: "Pak'nSave", price: 279, unit: "pack", category: "Pantry", country: "NZ" },
  { name: "Fresh Mozzarella", supermarket: "Pak'nSave", price: 549, unit: "pack", category: "Dairy", country: "NZ" },
  { name: "Olive Oil 500ml", supermarket: "Pak'nSave", price: 799, unit: "bottle", category: "Pantry", country: "NZ" },
];

async function seed() {
  console.log("🌱 Seeding database...");
  
  try {
    // Seed recipes
    console.log("Adding recipes...");
    await db.insert(recipes).values(sampleRecipes);
    console.log(`✅ Added ${sampleRecipes.length} recipes`);
    
    // Seed supermarket products
    console.log("Adding supermarket products...");
    await db.insert(supermarketProducts).values(supermarketProductsData);
    console.log(`✅ Added ${supermarketProductsData.length} products`);
    
    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

seed();
