import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeGrid } from './components/RecipeGrid.jsx';
import { AIChat } from './components/AIChat.jsx';
import { ShoppingList } from './components/ShoppingList.jsx';
import { ProgressDashboard } from './components/ProgressDashboard.jsx';
import { SavedRecipesTab } from './components/SavedRecipesTab.jsx';
import AuthModal from './components/AuthModal.jsx';
import SubscriptionModal from './components/SubscriptionModal.jsx';
import authService from './services/authService.js';
import { ChefHat, Sparkles, ShoppingCart, TrendingUp, Search, Heart, User, LogOut, Crown, Zap } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const checkAuth = async () => {
      const result = await authService.verifyToken();
      if (result.success) {
        setCurrentUser(result.user);
      } else {
        setCurrentUser(null);
      }
    };
    checkAuth();
  }, []);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setActiveTab('discover'); // Redirect to discover after logout
  };

  const handleViewRecipe = (recipeId, recipeSource) => {
    // This function will be passed down to RecipeGrid and SavedRecipesTab
    // and will be responsible for opening the RecipeDetailModal
    // For now, we'll just log it. The modal logic is within RecipeGrid/SavedRecipesTab.
    console.log(`Viewing recipe: ${recipeId} from ${recipeSource}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Kitchen Spark
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ignite Your Inner Chef</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Badge 
                    variant="outline" 
                    className={`${
                      currentUser.subscription_tier === 'pro' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : currentUser.subscription_tier === 'premium'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {currentUser.subscription_tier === 'pro' && <Crown className="h-3 w-3 mr-1" />}
                    {currentUser.subscription_tier === 'premium' && <Zap className="h-3 w-3 mr-1" />}
                    {currentUser.subscription_tier === 'free' && <Sparkles className="h-3 w-3 mr-1" />}
                    {currentUser.subscription_tier.toUpperCase()} User
                  </Badge>
                  
                  {currentUser.subscription_tier === 'free' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsSubscriptionModalOpen(true)}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      Upgrade
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 dark:text-gray-300 hover:text-red-500">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                  <User className="h-4 w-4 mr-1" />
                  Sign In / Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Chef
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Shopping
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <RecipeGrid onRecipeClick={handleViewRecipe} />
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <SavedRecipesTab onRecipeClick={handleViewRecipe} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Kitchen Assistant</h2>
              <p className="text-gray-600 dark:text-gray-300">Chat with your AI cooking buddy for personalized recipes and tips</p>
            </div>
            <div className="h-[600px]">
              <AIChat />
            </div>
          </TabsContent>

          <TabsContent value="shopping" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Smart Shopping</h2>
              <p className="text-gray-600 dark:text-gray-300">AI-powered shopping lists optimized for health and budget</p>
            </div>
            <ShoppingList />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Progress</h2>
              <p className="text-gray-600 dark:text-gray-300">Track your cooking journey and celebrate achievements</p>
            </div>
            <ProgressDashboard />
          </TabsContent>
        </Tabs>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentTier={currentUser?.subscription_tier || 'free'}
      />
    </div>
  );
}

export default App;
