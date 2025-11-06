import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { subscriptionRouter, adminRouter } from "./routers-subscription";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  recipes: router({
    list: publicProcedure.query(async () => {
      return await db.getAllRecipes();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getRecipeById(input.id);
      }),
    
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.getAllRecipes();
      }),
    
    byCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getAllRecipes();
      }),
    
    saved: protectedProcedure.query(async ({ ctx }) => {
      return await db.getSavedRecipesByUserId(ctx.user.id);
    }),
    
    save: protectedProcedure
      .input(z.object({ recipeId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.saveRecipe(ctx.user.id, input.recipeId);
        return { success: true };
      }),
    
    unsave: protectedProcedure
      .input(z.object({ recipeId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.unsaveRecipe(ctx.user.id, input.recipeId);
        return { success: true };
      }),
    
    isSaved: protectedProcedure
      .input(z.object({ recipeId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.isRecipeSaved(ctx.user.id, input.recipeId);
      }),
  }),

  shopping: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getShoppingListByUserId(ctx.user.id);
    }),
    
    add: protectedProcedure
      .input(z.object({
        name: z.string(),
        quantity: z.string().optional(),
        category: z.string().optional(),
        recipeId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.addShoppingListItem(ctx.user.id, input.name, input.quantity);
        return { success: true };
      }),
    
    toggle: protectedProcedure
      .input(z.object({
        id: z.number(),
        completed: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.toggleShoppingListItem(input.id, input.completed);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteShoppingListItem(input.id);
        return { success: true };
      }),
    
    clearCompleted: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCompletedShoppingItems(ctx.user.id);
      return { success: true };
    }),
  }),

  supermarket: router({
    search: publicProcedure
      .input(z.object({
        query: z.string(),
        country: z.string().default("NZ"),
      }))
      .query(async ({ input }) => {
        return await db.searchSupermarketProducts(input.query, input.country);
      }),
    
    bySupermarket: publicProcedure
      .input(z.object({
        supermarket: z.string(),
        country: z.string().default("NZ"),
      }))
      .query(async ({ input }) => {
        return await db.searchSupermarketProducts(input.supermarket, input.country);
      }),
  }),

  chat: router({
    history: protectedProcedure.query(async ({ ctx }) => {
      return await db.getChatHistory(ctx.user.id);
    }),
    
    send: protectedProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.saveChatMessage(ctx.user.id, "user", input.message);
        
        // Get recent chat history for context
        const history = await db.getChatHistory(ctx.user.id);
        const messages = history.slice(-10).map((msg: any) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));
        
        // Call LLM with context
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are Kitchen Spark AI, a helpful cooking assistant. You help users with recipes, cooking tips, meal planning, and food-related questions. Be friendly, knowledgeable, and concise. When suggesting recipes, mention ingredients and cooking methods. Always prioritize food safety and dietary considerations."
            },
            ...messages,
          ],
        });
        
        const assistantMessage = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : JSON.stringify(response.choices[0].message.content);
        
        // Save assistant response
        await db.saveChatMessage(ctx.user.id, "assistant", assistantMessage);
        
        return {
          message: assistantMessage,
        };
      }),
  }),
  
  subscription: subscriptionRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
