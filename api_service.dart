import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use the deployed Flask backend URL
  static const String baseUrl = 'https://dyh6i3c0g3pl.manus.space';
  
  // Authentication endpoints
  static const String loginEndpoint = '/api/auth/login';
  static const String registerEndpoint = '/api/auth/register';
  static const String logoutEndpoint = '/api/auth/logout';
  
  // Recipe endpoints
  static const String recipesEndpoint = '/api/recipes';
  static const String savedRecipesEndpoint = '/api/recipes/saved';
  
  // User endpoints
  static const String userProfileEndpoint = '/api/user/profile';
  static const String userProgressEndpoint = '/api/user/progress';
  
  // Shopping list endpoints
  static const String shoppingListEndpoint = '/api/shopping';
  
  // AI Chat endpoints
  static const String aiChatEndpoint = '/api/ai/chat';

  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  static Map<String, String> _headersWithAuth(String? token) => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };

  // Authentication Methods
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$loginEndpoint'),
        headers: _headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Login failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$registerEndpoint'),
        headers: _headers,
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Registration failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<void> logout(String token) async {
    try {
      await http.post(
        Uri.parse('$baseUrl$logoutEndpoint'),
        headers: _headersWithAuth(token),
      );
    } catch (e) {
      // Logout can fail silently
      print('Logout error: $e');
    }
  }

  // Recipe Methods
  static Future<List<Map<String, dynamic>>> getRecipes({
    String? category,
    String? search,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final queryParams = <String, String>{
        'page': page.toString(),
        'limit': limit.toString(),
        if (category != null && category != 'All') 'category': category,
        if (search != null && search.isNotEmpty) 'search': search,
      };

      final uri = Uri.parse('$baseUrl$recipesEndpoint').replace(
        queryParameters: queryParams,
      );

      final response = await http.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['recipes'] ?? []);
      } else {
        throw Exception('Failed to fetch recipes: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<Map<String, dynamic>> getRecipeById(String recipeId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl$recipesEndpoint/$recipeId'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to fetch recipe: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<List<Map<String, dynamic>>> getSavedRecipes(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl$savedRecipesEndpoint'),
        headers: _headersWithAuth(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['recipes'] ?? []);
      } else {
        throw Exception('Failed to fetch saved recipes: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<void> saveRecipe(String token, String recipeId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$savedRecipesEndpoint'),
        headers: _headersWithAuth(token),
        body: jsonEncode({'recipe_id': recipeId}),
      );

      if (response.statusCode != 201) {
        throw Exception('Failed to save recipe: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<void> unsaveRecipe(String token, String recipeId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl$savedRecipesEndpoint/$recipeId'),
        headers: _headersWithAuth(token),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to unsave recipe: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // User Methods
  static Future<Map<String, dynamic>> getUserProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl$userProfileEndpoint'),
        headers: _headersWithAuth(token),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to fetch user profile: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<Map<String, dynamic>> getUserProgress(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl$userProgressEndpoint'),
        headers: _headersWithAuth(token),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to fetch user progress: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Shopping List Methods
  static Future<List<Map<String, dynamic>>> getShoppingList(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl$shoppingListEndpoint'),
        headers: _headersWithAuth(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['items'] ?? []);
      } else {
        throw Exception('Failed to fetch shopping list: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<Map<String, dynamic>> addShoppingItem(String token, String name, {String? category}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$shoppingListEndpoint'),
        headers: _headersWithAuth(token),
        body: jsonEncode({
          'name': name,
          if (category != null) 'category': category,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to add shopping item: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<void> updateShoppingItem(String token, String itemId, {bool? completed, String? name}) async {
    try {
      final body = <String, dynamic>{};
      if (completed != null) body['completed'] = completed;
      if (name != null) body['name'] = name;

      final response = await http.put(
        Uri.parse('$baseUrl$shoppingListEndpoint/$itemId'),
        headers: _headersWithAuth(token),
        body: jsonEncode(body),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to update shopping item: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<void> deleteShoppingItem(String token, String itemId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl$shoppingListEndpoint/$itemId'),
        headers: _headersWithAuth(token),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to delete shopping item: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // AI Chat Methods
  static Future<String> sendChatMessage(String message, {String? token}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$aiChatEndpoint'),
        headers: token != null ? _headersWithAuth(token) : _headers,
        body: jsonEncode({'message': message}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['response'] ?? 'Sorry, I couldn\'t process your request.';
      } else {
        throw Exception('Failed to send chat message: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Health check
  static Future<bool> checkServerHealth() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
        headers: _headers,
      ).timeout(const Duration(seconds: 5));

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

