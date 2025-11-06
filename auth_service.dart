import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userNameKey = 'user_name';
  static const String _userEmailKey = 'user_email';

  // Get stored authentication token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  // Store authentication token
  static Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  // Remove authentication token
  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  // Get stored user name
  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userNameKey);
  }

  // Store user name
  static Future<void> setUserName(String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userNameKey, name);
  }

  // Remove user name
  static Future<void> removeUserName() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userNameKey);
  }

  // Get stored user email
  static Future<String?> getUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userEmailKey);
  }

  // Store user email
  static Future<void> setUserEmail(String email) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userEmailKey, email);
  }

  // Remove user email
  static Future<void> removeUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userEmailKey);
  }

  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // Login user
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await ApiService.login(email, password);
      
      if (response['success'] == true) {
        final token = response['token'];
        final userData = response['user'];
        
        // Store authentication data
        await setToken(token);
        await setUserName(userData['name']);
        await setUserEmail(userData['email']);
        
        return {
          'success': true,
          'user': userData,
          'token': token,
        };
      } else {
        return {
          'success': false,
          'message': response['message'] ?? 'Login failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': e.toString().replaceAll('Exception: ', ''),
      };
    }
  }

  // Register user
  static Future<Map<String, dynamic>> register(String name, String email, String password) async {
    try {
      final response = await ApiService.register(name, email, password);
      
      if (response['success'] == true) {
        final token = response['token'];
        final userData = response['user'];
        
        // Store authentication data
        await setToken(token);
        await setUserName(userData['name']);
        await setUserEmail(userData['email']);
        
        return {
          'success': true,
          'user': userData,
          'token': token,
        };
      } else {
        return {
          'success': false,
          'message': response['message'] ?? 'Registration failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': e.toString().replaceAll('Exception: ', ''),
      };
    }
  }

  // Logout user
  static Future<void> logout() async {
    try {
      final token = await getToken();
      if (token != null) {
        await ApiService.logout(token);
      }
    } catch (e) {
      // Logout can fail silently
      print('Logout error: $e');
    } finally {
      // Always clear local data
      await removeToken();
      await removeUserName();
      await removeUserEmail();
    }
  }

  // Get current user data
  static Future<Map<String, String?>> getCurrentUser() async {
    return {
      'name': await getUserName(),
      'email': await getUserEmail(),
      'token': await getToken(),
    };
  }

  // Validate token (check if it's still valid)
  static Future<bool> validateToken() async {
    try {
      final token = await getToken();
      if (token == null) return false;

      // Try to fetch user profile to validate token
      await ApiService.getUserProfile(token);
      return true;
    } catch (e) {
      // Token is invalid, clear it
      await logout();
      return false;
    }
  }

  // Auto-login on app start
  static Future<Map<String, dynamic>?> autoLogin() async {
    try {
      final isValid = await validateToken();
      if (!isValid) return null;

      final userData = await getCurrentUser();
      if (userData['name'] != null && userData['email'] != null) {
        return {
          'success': true,
          'user': {
            'name': userData['name'],
            'email': userData['email'],
          },
          'token': userData['token'],
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

