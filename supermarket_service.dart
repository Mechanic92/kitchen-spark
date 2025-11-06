import 'dart:convert';
import 'package:http/http.dart' as http;

class SupermarketService {
  static const String baseUrl = 'http://127.0.0.1:5000'; // Placeholder API URL
  
  static const Map<String, List<String>> supermarketsByCountry = {
    'NZ': ['Countdown', 'New World', 'Pak\'nSave'],
    'AU': ['Woolworths', 'Coles', 'IGA'],
    'US': ['Walmart', 'Target', 'Kroger'],
    'UK': ['Tesco', 'Sainsbury\'s', 'ASDA'],
  };

  static Future<List<Product>> searchProducts(String query, {String? supermarket}) async {
    try {
      final uri = Uri.parse('$baseUrl/products').replace(queryParameters: {
        'q': query,
        if (supermarket != null) 'supermarket': supermarket,
      });

      final response = await http.get(uri);
      
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((item) => Product.fromJson(item)).toList();
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      // Return sample data if API is not available
      return _getSampleProducts(query, supermarket);
    }
  }

  static Future<Map<String, List<Product>>> compareProductPrices(String productName, String countryCode) async {
    final supermarkets = supermarketsByCountry[countryCode] ?? [];
    final Map<String, List<Product>> comparison = {};

    for (final supermarket in supermarkets) {
      try {
        final products = await searchProducts(productName, supermarket: supermarket);
        comparison[supermarket] = products;
      } catch (e) {
        comparison[supermarket] = [];
      }
    }

    return comparison;
  }

  static List<String> getSupermarketsForCountry(String countryCode) {
    return supermarketsByCountry[countryCode] ?? [];
  }

  static List<Product> _getSampleProducts(String query, String? supermarket) {
    final sampleProducts = [
      Product(
        name: 'Fresh Fruit Bananas',
        price: 3.65,
        supermarket: 'Countdown',
        unit: 'kg',
        category: 'Fruit',
      ),
      Product(
        name: 'Fresh Vegetable Broccoli',
        price: 2.30,
        supermarket: 'Countdown',
        unit: 'ea',
        category: 'Vegetables',
      ),
      Product(
        name: 'Fresh Bananas Organic',
        price: 4.20,
        supermarket: 'New World',
        unit: 'kg',
        category: 'Fruit',
      ),
      Product(
        name: 'Broccoli Crown',
        price: 2.50,
        supermarket: 'New World',
        unit: 'ea',
        category: 'Vegetables',
      ),
    ];

    return sampleProducts
        .where((product) => 
            product.name.toLowerCase().contains(query.toLowerCase()) &&
            (supermarket == null || product.supermarket == supermarket))
        .toList();
  }
}

class Product {
  final String name;
  final double price;
  final String supermarket;
  final String unit;
  final String category;
  final String? imageUrl;

  Product({
    required this.name,
    required this.price,
    required this.supermarket,
    required this.unit,
    required this.category,
    this.imageUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      name: json['name'] ?? '',
      price: double.tryParse(json['price'].toString()) ?? 0.0,
      supermarket: json['supermarket'] ?? '',
      unit: json['unit'] ?? 'ea',
      category: json['category'] ?? 'General',
      imageUrl: json['imageUrl'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'price': price,
      'supermarket': supermarket,
      'unit': unit,
      'category': category,
      'imageUrl': imageUrl,
    };
  }
}
