import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  ChefHat, 
  Send,
  ArrowLeft,
  Bot,
  User,
  Sparkles
} from "lucide-react";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Streamdown } from "streamdown";

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: chatHistory, refetch } = trpc.chat.history.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const sendMessageMutation = trpc.chat.send.useMutation({
    onSuccess: () => {
      refetch();
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    },
  });
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="neumorphic-flat border-none p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full tesla-gradient mx-auto mb-4 flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to Chat</h2>
            <p className="text-muted-foreground mb-6">
              Get personalized cooking advice from our AI chef
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
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;
    
    const userMessage = message;
    setMessage("");
    setIsTyping(true);
    
    try {
      await sendMessageMutation.mutateAsync({ message: userMessage });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
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
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">AI Chef Assistant</h1>
                <p className="text-xs text-muted-foreground">Powered by Kitchen Spark</p>
              </div>
            </div>
            <div className="neumorphic-flat px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">{user?.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {!chatHistory || chatHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full tesla-gradient mx-auto mb-6 flex items-center justify-center animate-float">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to AI Chef!</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Ask me anything about recipes, cooking techniques, meal planning, or food-related questions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card 
                  className="neumorphic-flat border-none p-4 cursor-pointer hover-lift"
                  onClick={() => setMessage("What's a quick and healthy dinner recipe?")}
                >
                  <p className="text-sm font-medium">Quick & Healthy Dinner</p>
                  <p className="text-xs text-muted-foreground mt-1">Get recipe suggestions</p>
                </Card>
                <Card 
                  className="neumorphic-flat border-none p-4 cursor-pointer hover-lift"
                  onClick={() => setMessage("How do I cook the perfect steak?")}
                >
                  <p className="text-sm font-medium">Cooking Techniques</p>
                  <p className="text-xs text-muted-foreground mt-1">Learn professional tips</p>
                </Card>
                <Card 
                  className="neumorphic-flat border-none p-4 cursor-pointer hover-lift"
                  onClick={() => setMessage("Help me plan meals for the week")}
                >
                  <p className="text-sm font-medium">Meal Planning</p>
                  <p className="text-xs text-muted-foreground mt-1">Weekly meal prep</p>
                </Card>
                <Card 
                  className="neumorphic-flat border-none p-4 cursor-pointer hover-lift"
                  onClick={() => setMessage("What can I make with chicken and vegetables?")}
                >
                  <p className="text-sm font-medium">Ingredient Ideas</p>
                  <p className="text-xs text-muted-foreground mt-1">Use what you have</p>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    msg.role === "user" 
                      ? "tesla-gradient-blue" 
                      : "tesla-gradient"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <Card className={`max-w-[80%] neumorphic-flat border-none ${
                    msg.role === "user" ? "bg-blue-50" : ""
                  }`}>
                    <CardContent className="p-4">
                      {msg.role === "assistant" ? (
                        <Streamdown>{msg.content}</Streamdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full tesla-gradient flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <Card className="neumorphic-flat border-none">
                    <CardContent className="p-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 glass-morphism border-t border-white/20">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1 neumorphic-flat rounded-2xl p-2">
              <Input
                type="text"
                placeholder="Ask me anything about cooking..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isTyping}
                className="bg-transparent border-none h-12 text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || isTyping}
              className="tesla-gradient text-white h-14 px-8 rounded-2xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-2">
            AI Chef can make mistakes. Always verify cooking times and food safety.
          </p>
        </div>
      </div>
    </div>
  );
}
