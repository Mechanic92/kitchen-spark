import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "premium", "pro"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "canceled", "past_due", "trialing"]),
  subscriptionEndsAt: timestamp("subscriptionEndsAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription plans
 */
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  tier: mysqlEnum("tier", ["free", "premium", "pro"]).notNull().unique(),
  priceMonthly: int("priceMonthly").notNull(), // in cents
  priceYearly: int("priceYearly").notNull(), // in cents
  stripePriceIdMonthly: varchar("stripePriceIdMonthly", { length: 255 }),
  stripePriceIdYearly: varchar("stripePriceIdYearly", { length: 255 }),
  features: text("features").notNull(), // JSON array of features
  maxAiMessages: int("maxAiMessages").default(0), // 0 = unlimited
  maxRecipeSaves: int("maxRecipeSaves").default(0), // 0 = unlimited
  hasPriceAlerts: boolean("hasPriceAlerts").default(false),
  hasMealPlanning: boolean("hasMealPlanning").default(false),
  hasPdfExport: boolean("hasPdfExport").default(false),
  hasExclusiveRecipes: boolean("hasExclusiveRecipes").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * Payment transactions
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("NZD"),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "refunded"]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Recipes table with images and YouTube videos
 */
export const recipes = mysqlTable("recipes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  youtubeVideoId: varchar("youtubeVideoId", { length: 64 }),
  prepTime: int("prepTime"), // in minutes
  cookTime: int("cookTime"), // in minutes
  servings: int("servings"),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium"),
  category: varchar("category", { length: 100 }),
  cuisine: varchar("cuisine", { length: 100 }),
  rating: int("rating").default(0), // average rating * 10 (e.g., 45 = 4.5 stars)
  viewCount: int("viewCount").default(0),
  isPremium: boolean("isPremium").default(false), // Premium exclusive content
  ingredients: text("ingredients"), // JSON array of ingredients
  instructions: text("instructions"), // JSON array of steps
  nutritionInfo: text("nutritionInfo"), // JSON object with nutrition data
  tags: text("tags"), // JSON array of tags
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = typeof recipes.$inferInsert;

/**
 * Saved recipes - user favorites
 */
export const savedRecipes = mysqlTable("savedRecipes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  recipeId: int("recipeId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedRecipe = typeof savedRecipes.$inferSelect;
export type InsertSavedRecipe = typeof savedRecipes.$inferInsert;

/**
 * Shopping list items
 */
export const shoppingListItems = mysqlTable("shoppingListItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: varchar("quantity", { length: 100 }),
  category: varchar("category", { length: 100 }),
  completed: boolean("completed").default(false),
  recipeId: int("recipeId"), // optional link to recipe
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShoppingListItem = typeof shoppingListItems.$inferSelect;
export type InsertShoppingListItem = typeof shoppingListItems.$inferInsert;

/**
 * Supermarket products for price comparison
 */
export const supermarketProducts = mysqlTable("supermarketProducts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  supermarket: varchar("supermarket", { length: 100 }).notNull(),
  price: int("price").notNull(), // price in cents
  unit: varchar("unit", { length: 50 }),
  category: varchar("category", { length: 100 }),
  imageUrl: varchar("imageUrl", { length: 512 }),
  country: varchar("country", { length: 2 }).default("NZ"), // ISO country code
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
});

export type SupermarketProduct = typeof supermarketProducts.$inferSelect;
export type InsertSupermarketProduct = typeof supermarketProducts.$inferInsert;

/**
 * Price alerts for premium users
 */
export const priceAlerts = mysqlTable("priceAlerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  targetPrice: int("targetPrice").notNull(), // in cents
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = typeof priceAlerts.$inferInsert;

/**
 * Chat messages with AI agent
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * AI message usage tracking for free tier limits
 */
export const aiMessageUsage = mysqlTable("aiMessageUsage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  messageCount: int("messageCount").default(0),
  resetAt: timestamp("resetAt").notNull(), // Monthly reset
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiMessageUsage = typeof aiMessageUsage.$inferSelect;
export type InsertAiMessageUsage = typeof aiMessageUsage.$inferInsert;

/**
 * Meal planning calendar (premium feature)
 */
export const mealPlans = mysqlTable("mealPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  recipeId: int("recipeId").notNull(),
  plannedDate: timestamp("plannedDate").notNull(),
  mealType: mysqlEnum("mealType", ["breakfast", "lunch", "dinner", "snack"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = typeof mealPlans.$inferInsert;
