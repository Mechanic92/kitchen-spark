import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { 
  ChefHat, 
  Search, 
  Clock, 
  Users, 
  Star, 
  BookmarkPlus, 
  BookmarkCheck,
  Play,
  ShoppingCart,
  MessageCircle,
  Globe,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("NZ");
  
  const { data: recipes, isLoading: recipesLoading } = trpc.recipes.list.useQuery();
  const { data: savedRecipes } = trpc.recipes.saved.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const saveRecipeMutation = trpc.recipes.save.useMutation();
  const unsaveRecipeMutation = trpc.recipes.unsave.useMutation();
  
  const utils = trpc.useUtils();
  
  const handleSaveRecipe = async (recipeId: number) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    
    const isSaved = savedRecipes?.some(sr => sr.recipe.id === recipeId);
    
    if (isSaved) {
      await unsaveRecipeMutation.mutateAsync({ recipeId });
    } else {
      await saveRecipeMutation.mutateAsync({ recipeId });
    }
    
    utils.recipes.saved.invalidate();
  };
  
  const isRecipeSaved = (recipeId: number) => {
    return savedRecipes?.some(sr => sr.recipe.id === recipeId) || false;
  };
  
  const filteredRecipes = recipes?.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full tesla-gradient flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">{APP_TITLE}</h1>
                <p className="text-sm text-muted-foreground">Ignite Your Inner Chef</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="neumorphic-flat px-3 py-2 rounded-lg text-sm font-medium border-none outline-none"
                >
                  <option value="NZ">🇳🇿 New Zealand</option>
                  <option value="AU">🇦🇺 Australia</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="GB">🇬🇧 United Kingdom</option>
                </select>
              </div>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link href="/chat">
                    <Button variant="outline" size="sm" className="neumorphic-flat">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      AI Chef
                    </Button>
                  </Link>
                  <Link href="/shopping">
                    <Button variant="outline" size="sm" className="neumorphic-flat">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Shopping
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm" className="tesla-gradient text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  </Link>
                  <div className="neumorphic-flat px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium">{user?.name}</p>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => window.location.href = getLoginUrl()}
                  className="tesla-gradient text-white hover:opacity-90"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4">
            <Badge className="tesla-gradient text-white px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Powered by AI
            </Badge>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Your Next
            <span className="gradient-text"> Culinary Adventure</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore gourmet recipes, compare supermarket prices, and get personalized cooking advice from our AI chef.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto neumorphic-flat rounded-2xl p-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search recipes, ingredients, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 border-none h-12"
                />
              </div>
              <Button className="tesla-gradient text-white h-12 px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="neumorphic-flat border-none hover-lift">
              <CardHeader>
                <div className="w-12 h-12 rounded-full tesla-gradient-blue flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Smart Price Comparison</CardTitle>
                <CardDescription>
                  Compare prices across Countdown, New World, and Pak'nSave to save money on your grocery shopping.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="neumorphic-flat border-none hover-lift">
              <CardHeader>
                <div className="w-12 h-12 rounded-full tesla-gradient-green flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI Cooking Assistant</CardTitle>
                <CardDescription>
                  Get personalized recipe recommendations, cooking tips, and answers to all your culinary questions.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="neumorphic-flat border-none hover-lift">
              <CardHeader>
                <div className="w-12 h-12 rounded-full tesla-gradient-orange flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Follow along with embedded YouTube cooking videos for step-by-step guidance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">Featured Recipes</h3>
              <p className="text-muted-foreground">Curated collection of gourmet dishes</p>
            </div>
          </div>
          
          {recipesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="neumorphic-flat border-none animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes?.map((recipe) => (
                <Card key={recipe.id} className="neumorphic-flat border-none hover-lift overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={recipe.imageUrl || "/placeholder-recipe.jpg"}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full bg-white/90 hover:bg-white"
                        onClick={() => handleSaveRecipe(recipe.id)}
                      >
                        {isRecipeSaved(recipe.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-purple-600" />
                        ) : (
                          <BookmarkPlus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {recipe.youtubeVideoId && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-red-600 text-white">
                          <Play className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-1">{recipe.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{((recipe.rating || 0) / 10).toFixed(1)}</span>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} servings
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{recipe.difficulty}</Badge>
                      <Badge variant="outline" className="text-xs">{recipe.cuisine}</Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Link href={`/recipe/${recipe.id}`} className="w-full">
                      <Button className="w-full tesla-gradient text-white">
                        View Recipe
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full tesla-gradient flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">{APP_TITLE}</h3>
          </div>
          <p className="text-slate-400 mb-6">
            Your culinary journey starts here. Discover, cook, and save with Kitchen Spark.
          </p>
          <div className="flex items-center justify-center gap-6 mb-4">
            <Link href="/privacy">
              <Button variant="link" className="text-slate-400 hover:text-white">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="link" className="text-slate-400 hover:text-white">
                Terms of Service
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="link" className="text-slate-400 hover:text-white">
                Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            © 2025 Kitchen Spark. All rights reserved. Made with ❤️ in New Zealand.
          </p>
        </div>
      </footer>
    </div>
  );
}
