import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { 
  ChefHat, 
  Search,
  ArrowLeft,
  ShoppingCart,
  Plus,
  Trash2,
  TrendingDown,
  Store,
  DollarSign
} from "lucide-react";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Shopping() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  
  const { data: shoppingList, refetch: refetchList } = trpc.shopping.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const { data: priceResults } = trpc.supermarket.search.useQuery(
    { query: searchQuery, country: "NZ" },
    { enabled: searchQuery.length > 2 }
  );
  
  const addItemMutation = trpc.shopping.add.useMutation({
    onSuccess: () => {
      refetchList();
      setNewItemName("");
      setNewItemQuantity("");
    },
  });
  
  const toggleItemMutation = trpc.shopping.toggle.useMutation({
    onSuccess: () => refetchList(),
  });
  
  const deleteItemMutation = trpc.shopping.delete.useMutation({
    onSuccess: () => refetchList(),
  });
  
  const clearCompletedMutation = trpc.shopping.clearCompleted.useMutation({
    onSuccess: () => refetchList(),
  });
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="neumorphic-flat border-none p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full tesla-gradient-blue mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to Shop</h2>
            <p className="text-muted-foreground mb-6">
              Create shopping lists and compare prices across supermarkets
            </p>
            <Button 
              onClick={() => window.location.href = getLoginUrl()}
              className="tesla-gradient text-white w-full"
            >
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    await addItemMutation.mutateAsync({
      name: newItemName,
      quantity: newItemQuantity || undefined,
    });
  };
  
  const handleToggleItem = async (id: number, completed: boolean) => {
    await toggleItemMutation.mutateAsync({ id, completed: !completed });
  };
  
  const handleDeleteItem = async (id: number) => {
    await deleteItemMutation.mutateAsync({ id });
  };
  
  const handleClearCompleted = async () => {
    await clearCompletedMutation.mutateAsync();
  };
  
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  const groupedPrices = priceResults?.reduce((acc, product) => {
    if (!acc[product.name]) {
      acc[product.name] = [];
    }
    acc[product.name].push(product);
    return acc;
  }, {} as Record<string, typeof priceResults>);
  
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
              <div className="w-10 h-10 rounded-full tesla-gradient-blue flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">Smart Shopping</h1>
                <p className="text-xs text-muted-foreground">Save money with price comparison</p>
              </div>
            </div>
            <div className="neumorphic-flat px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">{user?.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="neumorphic-flat grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="list">Shopping List</TabsTrigger>
            <TabsTrigger value="compare">Price Comparison</TabsTrigger>
          </TabsList>

          {/* Shopping List Tab */}
          <TabsContent value="list" className="space-y-6">
            {/* Add Item Form */}
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddItem} className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Item name..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="Quantity..."
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    className="w-32"
                  />
                  <Button type="submit" className="tesla-gradient-blue text-white">
                    Add
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Shopping List */}
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Shopping List</CardTitle>
                  {shoppingList && shoppingList.some(item => item.completed) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCompleted}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Completed
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!shoppingList || shoppingList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Your shopping list is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shoppingList.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg neumorphic-flat ${
                          item.completed ? "opacity-50" : ""
                        }`}
                      >
                        <Checkbox
                          checked={item.completed || false}
                          onCheckedChange={() => handleToggleItem(item.id, item.completed || false)}
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${item.completed ? "line-through" : ""}`}>
                            {item.name}
                          </p>
                          {item.quantity && (
                            <p className="text-sm text-muted-foreground">{item.quantity}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price Comparison Tab */}
          <TabsContent value="compare" className="space-y-6">
            {/* Search */}
            <Card className="neumorphic-flat border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Compare Prices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Price Results */}
            {searchQuery.length > 2 && (
              <div className="space-y-6">
                {!priceResults || priceResults.length === 0 ? (
                  <Card className="neumorphic-flat border-none">
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No products found</p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(groupedPrices || {}).map(([productName, products]) => {
                    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
                    const lowestPrice = sortedProducts[0].price;
                    
                    return (
                      <Card key={productName} className="neumorphic-flat border-none">
                        <CardHeader>
                          <CardTitle className="text-lg">{productName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {sortedProducts.map((product, index) => (
                              <div
                                key={product.id}
                                className={`flex items-center justify-between p-4 rounded-lg ${
                                  product.price === lowestPrice
                                    ? "bg-green-50 border-2 border-green-500"
                                    : "bg-white/50"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Store className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{product.supermarket}</p>
                                    <p className="text-sm text-muted-foreground">{product.unit}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-green-600">
                                    {formatPrice(product.price)}
                                  </p>
                                  {product.price === lowestPrice && (
                                    <Badge className="bg-green-600 text-white mt-1">
                                      Best Price
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
