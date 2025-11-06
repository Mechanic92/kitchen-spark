import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

class AppState extends ChangeNotifier {
  int _currentIndex = 0;
  bool _isDarkMode = false;
  String _userName = '';
  String _userEmail = '';
  bool _isLoggedIn = false;
  String? _authToken;
  List<Map<String, dynamic>> _savedRecipes = [];
  List<Map<String, dynamic>> _shoppingList = [];
  int _sparkPoints = 0;
  bool _isLoading = false;
  String? _errorMessage;

  // Getters
  int get currentIndex => _currentIndex;
  bool get isDarkMode => _isDarkMode;
  String get userName => _userName;
  String get userEmail => _userEmail;
  bool get isLoggedIn => _isLoggedIn;
  String? get authToken => _authToken;
  List<Map<String, dynamic>> get savedRecipes => _savedRecipes;
  List<Map<String, dynamic>> get shoppingList => _shoppingList;
  int get sparkPoints => _sparkPoints;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Initialize app state
  Future<void> initialize() async {
    _setLoading(true);
    try {
      // Try auto-login
      final loginData = await AuthService.autoLogin();
      if (loginData != null && loginData['success'] == true) {
        _userName = loginData['user']['name'];
        _userEmail = loginData['user']['email'];
        _authToken = loginData['token'];
        _isLoggedIn = true;
        
        // Load user data
        await _loadUserData();
      }
    } catch (e) {
      _setError('Failed to initialize app: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Navigation
  void setCurrentIndex(int index) {
    _currentIndex = index;
    notifyListeners();
  }

  // Theme
  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    notifyListeners();
  }

  void setTheme(bool isDark) {
    _isDarkMode = isDark;
    notifyListeners();
  }

  // Loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  // Error handling
  void _setError(String? error) {
    _errorMessage = error;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  // User authentication
  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final result = await AuthService.login(email, password);
      
      if (result['success'] == true) {
        _userName = result['user']['name'];
        _userEmail = result['user']['email'];
        _authToken = result['token'];
        _isLoggedIn = true;
        
        // Load user data after successful login
        await _loadUserData();
        
        _setLoading(false);
        return true;
      } else {
        _setError(result['message']);
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Login failed: $e');
      _setLoading(false);
      return false;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final result = await AuthService.register(name, email, password);
      
      if (result['success'] == true) {
        _userName = result['user']['name'];
        _userEmail = result['user']['email'];
        _authToken = result['token'];
        _isLoggedIn = true;
        
        // Initialize user data for new user
        _savedRecipes = [];
        _shoppingList = [];
        _sparkPoints = 0;
        
        _setLoading(false);
        return true;
      } else {
        _setError(result['message']);
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Registration failed: $e');
      _setLoading(false);
      return false;
    }
  }

  Future<void> logout() async {
    _setLoading(true);
    
    try {
      await AuthService.logout();
    } catch (e) {
      // Logout can fail silently
    } finally {
      _userName = '';
      _userEmail = '';
      _authToken = null;
      _isLoggedIn = false;
      _savedRecipes.clear();
      _shoppingList.clear();
      _sparkPoints = 0;
      _setLoading(false);
    }
  }

  // Load user data from backend
  Future<void> _loadUserData() async {
    if (!_isLoggedIn || _authToken == null) return;

    try {
      // Load saved recipes
      final recipes = await ApiService.getSavedRecipes(_authToken!);
      _savedRecipes = recipes;

      // Load shopping list
      final shopping = await ApiService.getShoppingList(_authToken!);
      _shoppingList = shopping;

      // Load user progress
      final progress = await ApiService.getUserProgress(_authToken!);
      _sparkPoints = progress['spark_points'] ?? 0;

      notifyListeners();
    } catch (e) {
      // Don't show error for data loading failures
      print('Failed to load user data: $e');
    }
  }

  // Recipes
  Future<void> addSavedRecipe(Map<String, dynamic> recipe) async {
    if (!_isLoggedIn || _authToken == null) {
      _setError('Please log in to save recipes');
      return;
    }

    try {
      await ApiService.saveRecipe(_authToken!, recipe['id']);
      _savedRecipes.add(recipe);
      _sparkPoints += 10; // Award points for saving recipes
      notifyListeners();
    } catch (e) {
      _setError('Failed to save recipe: $e');
    }
  }

  Future<void> removeSavedRecipe(String recipeId) async {
    if (!_isLoggedIn || _authToken == null) return;

    try {
      await ApiService.unsaveRecipe(_authToken!, recipeId);
      _savedRecipes.removeWhere((recipe) => recipe['id'] == recipeId);
      notifyListeners();
    } catch (e) {
      _setError('Failed to remove recipe: $e');
    }
  }

  bool isRecipeSaved(String recipeId) {
    return _savedRecipes.any((recipe) => recipe['id'] == recipeId);
  }

  // Shopping list
  Future<void> addToShoppingList(Map<String, dynamic> item) async {
    if (!_isLoggedIn || _authToken == null) {
      // Allow offline usage
      _shoppingList.add(item);
      notifyListeners();
      return;
    }

    try {
      final result = await ApiService.addShoppingItem(
        _authToken!,
        item['name'],
        category: item['category'],
      );
      
      // Update local list with server response
      _shoppingList.add(result);
      notifyListeners();
    } catch (e) {
      // Fallback to local storage
      _shoppingList.add(item);
      notifyListeners();
    }
  }

  Future<void> removeFromShoppingList(String itemId) async {
    if (_isLoggedIn && _authToken != null) {
      try {
        await ApiService.deleteShoppingItem(_authToken!, itemId);
      } catch (e) {
        // Continue with local removal even if server fails
      }
    }
    
    _shoppingList.removeWhere((item) => item['id'] == itemId);
    notifyListeners();
  }

  Future<void> toggleShoppingListItem(String itemId) async {
    final index = _shoppingList.indexWhere((item) => item['id'] == itemId);
    if (index == -1) return;

    final item = _shoppingList[index];
    final newCompleted = !item['completed'];
    
    if (_isLoggedIn && _authToken != null) {
      try {
        await ApiService.updateShoppingItem(
          _authToken!,
          itemId,
          completed: newCompleted,
        );
      } catch (e) {
        // Continue with local update even if server fails
      }
    }

    _shoppingList[index]['completed'] = newCompleted;
    if (newCompleted) {
      _sparkPoints += 5; // Award points for completing shopping items
    }
    notifyListeners();
  }

  void clearCompletedShoppingItems() {
    _shoppingList.removeWhere((item) => item['completed'] == true);
    notifyListeners();
  }

  // Spark Points
  void addSparkPoints(int points) {
    _sparkPoints += points;
    notifyListeners();
  }

  void resetSparkPoints() {
    _sparkPoints = 0;
    notifyListeners();
  }

  // Get user level based on spark points
  int get userLevel {
    if (_sparkPoints < 100) return 1;
    if (_sparkPoints < 300) return 2;
    if (_sparkPoints < 600) return 3;
    if (_sparkPoints < 1000) return 4;
    return 5;
  }

  String get userLevelTitle {
    switch (userLevel) {
      case 1:
        return 'Kitchen Newbie';
      case 2:
        return 'Cooking Apprentice';
      case 3:
        return 'Kitchen Explorer';
      case 4:
        return 'Culinary Artist';
      case 5:
        return 'Master Chef';
      default:
        return 'Kitchen Newbie';
    }
  }

  // Refresh data from server
  Future<void> refreshData() async {
    if (_isLoggedIn && _authToken != null) {
      await _loadUserData();
    }
  }
}

