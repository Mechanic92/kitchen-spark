import { eq, and, desc, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  recipes, 
  savedRecipes,
  shoppingListItems,
  supermarketProducts,
  chatMessages,
  subscriptionPlans,
  transactions,
  priceAlerts,
  aiMessageUsage,
  mealPlans
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Recipe queries
export async function getAllRecipes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(recipes).orderBy(desc(recipes.rating));
}

export async function getRecipeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getSavedRecipesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: savedRecipes.id,
      createdAt: savedRecipes.createdAt,
      recipe: recipes,
    })
    .from(savedRecipes)
    .innerJoin(recipes, eq(savedRecipes.recipeId, recipes.id))
    .where(eq(savedRecipes.userId, userId))
    .orderBy(desc(savedRecipes.createdAt));
  
  return result;
}

export async function isRecipeSaved(userId: number, recipeId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select()
    .from(savedRecipes)
    .where(and(eq(savedRecipes.userId, userId), eq(savedRecipes.recipeId, recipeId)))
    .limit(1);
  
  return result.length > 0;
}

export async function saveRecipe(userId: number, recipeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(savedRecipes).values({ userId, recipeId });
}

export async function unsaveRecipe(userId: number, recipeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(savedRecipes).where(
    and(eq(savedRecipes.userId, userId), eq(savedRecipes.recipeId, recipeId))
  );
}

// Shopping list queries
export async function getShoppingListByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(shoppingListItems)
    .where(eq(shoppingListItems.userId, userId))
    .orderBy(desc(shoppingListItems.createdAt));
}

export async function addShoppingListItem(userId: number, name: string, quantity?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(shoppingListItems).values({ userId, name, quantity });
}

export async function toggleShoppingListItem(id: number, completed: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(shoppingListItems).set({ completed }).where(eq(shoppingListItems.id, id));
}

export async function deleteShoppingListItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(shoppingListItems).where(eq(shoppingListItems.id, id));
}

export async function clearCompletedShoppingItems(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(shoppingListItems).where(
    and(eq(shoppingListItems.userId, userId), eq(shoppingListItems.completed, true))
  );
}

// Supermarket product queries
export async function searchSupermarketProducts(query: string, country: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(supermarketProducts)
    .where(and(
      eq(supermarketProducts.country, country),
      // Simple search - in production, use full-text search
    ))
    .limit(50);
}

// Chat queries
export async function getChatHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(chatMessages.createdAt)
    .limit(100);
}

export async function saveChatMessage(userId: number, role: "user" | "assistant", content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(chatMessages).values({ userId, role, content });
}

// Subscription queries
export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscriptionPlans).orderBy(subscriptionPlans.priceMonthly);
}

export async function getSubscriptionPlanByTier(tier: "free" | "premium" | "pro") {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.tier, tier)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserSubscription(userId: number, data: {
  subscriptionTier?: "free" | "premium" | "pro";
  stripeCustomerId?: string;
  subscriptionStatus?: "active" | "canceled" | "past_due" | "trialing";
  subscriptionEndsAt?: Date | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set(data).where(eq(users.id, userId));
}

// Transaction queries
export async function createTransaction(data: {
  userId: number;
  stripePaymentId: string;
  amount: number;
  currency?: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  description?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(transactions).values(data);
}

export async function getTransactionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));
}

// AI message usage tracking
export async function getAiMessageUsage(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const now = new Date();
  const result = await db
    .select()
    .from(aiMessageUsage)
    .where(and(
      eq(aiMessageUsage.userId, userId),
      gte(aiMessageUsage.resetAt, now)
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function incrementAiMessageUsage(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const usage = await getAiMessageUsage(userId);
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  if (usage) {
    await db
      .update(aiMessageUsage)
      .set({ messageCount: (usage.messageCount || 0) + 1 })
      .where(eq(aiMessageUsage.id, usage.id));
  } else {
    await db.insert(aiMessageUsage).values({
      userId,
      messageCount: 1,
      resetAt: nextMonth,
    });
  }
}

// Price alerts
export async function getPriceAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(priceAlerts)
    .where(and(eq(priceAlerts.userId, userId), eq(priceAlerts.isActive, true)))
    .orderBy(desc(priceAlerts.createdAt));
}

export async function createPriceAlert(userId: number, productName: string, targetPrice: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(priceAlerts).values({ userId, productName, targetPrice });
}

// Meal planning
export async function getMealPlans(userId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      mealPlan: mealPlans,
      recipe: recipes,
    })
    .from(mealPlans)
    .innerJoin(recipes, eq(mealPlans.recipeId, recipes.id))
    .where(and(
      eq(mealPlans.userId, userId),
      gte(mealPlans.plannedDate, startDate),
    ))
    .orderBy(mealPlans.plannedDate);
}

export async function createMealPlan(data: {
  userId: number;
  recipeId: number;
  plannedDate: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(mealPlans).values(data);
}
