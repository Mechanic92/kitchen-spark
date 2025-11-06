import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { 
  ChefHat, 
  Check,
  ArrowLeft,
  Sparkles,
  Crown,
  Rocket
} from "lucide-react";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  
  const { data: plans, isLoading } = trpc.subscription.plans.useQuery();
  const { data: currentSubscription } = trpc.subscription.current.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const createCheckoutMutation = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });
  
  const handleSubscribe = async (planTier: "premium" | "pro") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    
    await createCheckoutMutation.mutateAsync({
      planTier,
      billingPeriod,
    });
  };
  
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case "free":
        return <ChefHat className="w-8 h-8 text-white" />;
      case "premium":
        return <Sparkles className="w-8 h-8 text-white" />;
      case "pro":
        return <Rocket className="w-8 h-8 text-white" />;
      default:
        return <ChefHat className="w-8 h-8 text-white" />;
    }
  };
  
  const getPlanGradient = (tier: string) => {
    switch (tier) {
      case "free":
        return "bg-gradient-to-br from-gray-400 to-gray-600";
      case "premium":
        return "tesla-gradient";
      case "pro":
        return "tesla-gradient-orange";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full tesla-gradient flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold gradient-text">{APP_TITLE}</h1>
            </div>
            {isAuthenticated && (
              <div className="neumorphic-flat px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">{user?.name}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="tesla-gradient text-white px-4 py-2 text-sm mb-4">
            <Crown className="w-4 h-4 mr-2 inline" />
            Choose Your Plan
          </Badge>
          <h2 className="text-5xl font-bold mb-4">
            Unlock Your
            <span className="gradient-text"> Culinary Potential</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and upgrade anytime to access premium recipes, unlimited AI assistance, and exclusive features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 neumorphic-flat inline-flex px-6 py-3 rounded-full">
            <Label htmlFor="billing-toggle" className={billingPeriod === "monthly" ? "font-bold" : ""}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingPeriod === "yearly"}
              onCheckedChange={(checked) => setBillingPeriod(checked ? "yearly" : "monthly")}
            />
            <Label htmlFor="billing-toggle" className={billingPeriod === "yearly" ? "font-bold" : ""}>
              Yearly
              <Badge className="ml-2 bg-green-600 text-white">Save 17%</Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="neumorphic-flat border-none animate-pulse">
                <div className="h-64 bg-gray-200 rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans?.map((plan) => {
              const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly / 12;
              const isCurrentPlan = currentSubscription?.tier === plan.tier;
              const features = JSON.parse(plan.features);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`neumorphic-flat border-none hover-lift relative overflow-hidden ${
                    plan.tier === "premium" ? "md:scale-105 shadow-2xl" : ""
                  }`}
                >
                  {plan.tier === "premium" && (
                    <div className="absolute top-0 right-0">
                      <Badge className="bg-yellow-500 text-white rounded-tl-none rounded-br-none">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full ${getPlanGradient(plan.tier)} flex items-center justify-center mb-4`}>
                      {getPlanIcon(plan.tier)}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{formatPrice(price)}</span>
                      <span className="text-muted-foreground">/month</span>
                      {billingPeriod === "yearly" && plan.priceYearly > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Billed {formatPrice(plan.priceYearly)} yearly
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    {isCurrentPlan ? (
                      <Button className="w-full" variant="outline" disabled>
                        Current Plan
                      </Button>
                    ) : plan.tier === "free" ? (
                      <Link href="/" className="w-full">
                        <Button className="w-full" variant="outline">
                          Get Started Free
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className={`w-full ${getPlanGradient(plan.tier)} text-white`}
                        onClick={() => handleSubscribe(plan.tier as "premium" | "pro")}
                        disabled={createCheckoutMutation.isPending}
                      >
                        {createCheckoutMutation.isPending ? "Loading..." : "Upgrade Now"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.
                </p>
              </CardContent>
            </Card>
            
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our Free plan is available forever with no credit card required. You can upgrade to Premium or Pro anytime to unlock additional features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
