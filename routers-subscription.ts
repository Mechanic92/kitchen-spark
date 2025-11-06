import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { createCheckoutSession, createPortalSession } from "./_core/stripe";

export const subscriptionRouter = router({
  // Get all subscription plans
  plans: publicProcedure.query(async () => {
    return await db.getSubscriptionPlans();
  }),
  
  // Get current user's subscription
  current: protectedProcedure.query(async ({ ctx }) => {
    const plan = await db.getSubscriptionPlanByTier(ctx.user.subscriptionTier || "free");
    return {
      tier: ctx.user.subscriptionTier || "free",
      status: ctx.user.subscriptionStatus,
      endsAt: ctx.user.subscriptionEndsAt,
      plan,
    };
  }),
  
  // Create checkout session for subscription
  createCheckout: protectedProcedure
    .input(z.object({
      planTier: z.enum(["premium", "pro"]),
      billingPeriod: z.enum(["monthly", "yearly"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const plan = await db.getSubscriptionPlanByTier(input.planTier);
      if (!plan) {
        throw new Error("Plan not found");
      }
      
      const priceId = input.billingPeriod === "monthly" 
        ? plan.stripePriceIdMonthly 
        : plan.stripePriceIdYearly;
      
      if (!priceId) {
        throw new Error("Stripe price ID not configured. Please add Stripe keys in Settings → Secrets.");
      }
      
      const session = await createCheckoutSession({
        userId: ctx.user.id,
        userEmail: ctx.user.email || "",
        priceId,
        successUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/subscription/success`,
        cancelUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/pricing`,
        customerId: ctx.user.stripeCustomerId || undefined,
      });
      
      return { url: session.url };
    }),
  
  // Create portal session for managing subscription
  createPortal: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.stripeCustomerId) {
      throw new Error("No active subscription found");
    }
    
    const session = await createPortalSession({
      customerId: ctx.user.stripeCustomerId,
      returnUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/subscription`,
    });
    
    return { url: session.url };
  }),
  
  // Check feature access
  canAccess: protectedProcedure
    .input(z.object({
      feature: z.enum(["priceAlerts", "mealPlanning", "pdfExport", "exclusiveRecipes"]),
    }))
    .query(async ({ ctx, input }) => {
      const plan = await db.getSubscriptionPlanByTier(ctx.user.subscriptionTier || "free");
      if (!plan) return false;
      
      switch (input.feature) {
        case "priceAlerts":
          return plan.hasPriceAlerts;
        case "mealPlanning":
          return plan.hasMealPlanning;
        case "pdfExport":
          return plan.hasPdfExport;
        case "exclusiveRecipes":
          return plan.hasExclusiveRecipes;
        default:
          return false;
      }
    }),
  
  // Check AI message limit
  aiMessageLimit: protectedProcedure.query(async ({ ctx }) => {
    const plan = await db.getSubscriptionPlanByTier(ctx.user.subscriptionTier || "free");
    const usage = await db.getAiMessageUsage(ctx.user.id);
    
    return {
      limit: plan?.maxAiMessages || 0,
      used: usage?.messageCount || 0,
      unlimited: plan?.maxAiMessages === 0,
    };
  }),
  
  // Get billing history
  transactions: protectedProcedure.query(async ({ ctx }) => {
    return await db.getTransactionsByUserId(ctx.user.id);
  }),
});

export const adminRouter = router({
  // Get all users (admin only)
  users: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    
    // TODO: Implement pagination
    return [];
  }),
  
  // Get revenue metrics (admin only)
  revenue: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    
    // TODO: Implement revenue analytics
    return {
      total: 0,
      monthly: 0,
      subscriptions: {
        free: 0,
        premium: 0,
        pro: 0,
      },
    };
  }),
});
