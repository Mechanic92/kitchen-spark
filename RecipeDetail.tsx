import { useParams, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { 
  ChefHat, 
  Clock, 
  Users, 
  Star, 
  BookmarkPlus, 
  BookmarkCheck,
  ArrowLeft,
  Flame,
  Utensils,
  ShoppingCart
} from "lucide-react";
import { APP_TITLE, getLoginUrl } from "@/const";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const recipeId = parseInt(id || "0");
  
  const { data: recipe, isLoading } = trpc.recipes.getById.useQuery({ id: recipeId });
  const { data: isSaved } = trpc.recipes.isSaved.useQuery(
    { recipeId },
    { enabled: isAuthenticated }
  );
  
  const saveRecipeMutation = trpc.recipes.save.useMutation();
  const unsaveRecipeMutation = trpc.recipes.unsave.useMutation();
  const utils = trpc.useUtils();
  
  const handleSaveRecipe = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    
    if (isSaved) {
      await unsaveRecipeMutation.mutateAsync({ recipeId });
    } else {
      await saveRecipeMutation.mutateAsync({ recipeId });
    }
    
    utils.recipes.isSaved.invalidate({ recipeId });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse-glow">
          <ChefHat className="w-16 h-16 text-purple-600" />
        </div>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Recipe not found</h2>
          <Link href="/">
            <Button className="tesla-gradient text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : [];
  const instructions = recipe.instructions ? JSON.parse(recipe.instructions) : [];
  const nutritionInfo = recipe.nutritionInfo ? JSON.parse(recipe.nutritionInfo) : null;
  const tags = recipe.tags ? JSON.parse(recipe.tags) : [];
  
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
              <h1 className="text-xl font-bold gradient-text">{APP_TITLE}</h1>
            </div>
            <Button
              onClick={handleSaveRecipe}
              variant="outline"
              size="sm"
              className="neumorphic-flat"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 mr-2 text-purple-600" />
                  Saved
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <Card className="neumorphic-flat border-none overflow-hidden">
              <div className="relative h-96">
                <img
                  src={recipe.imageUrl || "/placeholder-recipe.jpg"}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
                  <p className="text-lg opacity-90">{recipe.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{((recipe.rating || 0) / 10).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-5 h-5" />
                      <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-5 h-5" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* YouTube Video */}
            {recipe.youtubeVideoId && (
              <Card className="neumorphic-flat border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-white" />
                    </div>
                    Video Tutorial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${recipe.youtubeVideoId}`}
                      title={recipe.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full tesla-gradient-green flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full tesla-gradient mt-2" />
                      <span className="flex-1">{ingredient}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <Link href="/shopping">
                  <Button className="w-full tesla-gradient-blue text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Shopping List
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full tesla-gradient-orange flex items-center justify-center">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full tesla-gradient flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <p className="flex-1 pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Prep Time</span>
                  <span className="font-medium">{recipe.prepTime} min</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cook Time</span>
                  <span className="font-medium">{recipe.cookTime} min</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Servings</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge variant="secondary">{recipe.difficulty}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cuisine</span>
                  <Badge variant="outline">{recipe.cuisine}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Info */}
            {nutritionInfo && (
              <Card className="neumorphic-flat border-none">
                <CardHeader>
                  <CardTitle>Nutrition Facts</CardTitle>
                  <p className="text-sm text-muted-foreground">Per serving</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Calories</span>
                    <span className="font-bold">{nutritionInfo.calories} kcal</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Protein</span>
                    <span className="font-medium">{nutritionInfo.protein}g</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Carbs</span>
                    <span className="font-medium">{nutritionInfo.carbs}g</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fat</span>
                    <span className="font-medium">{nutritionInfo.fat}g</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <Card className="neumorphic-flat border-none">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
