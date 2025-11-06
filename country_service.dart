import 'package:shared_preferences/shared_preferences.dart';

class CountryService {
  static const String _countryKey = 'selected_country';
  static const String _currencyKey = 'selected_currency';
  
  static const Map<String, Map<String, String>> supportedCountries = {
    'NZ': {
      'name': 'New Zealand',
      'currency': 'NZD',
      'symbol': '\$',
      'flag': '🇳🇿',
    },
    'AU': {
      'name': 'Australia',
      'currency': 'AUD',
      'symbol': '\$',
      'flag': '🇦🇺',
    },
    'US': {
      'name': 'United States',
      'currency': 'USD',
      'symbol': '\$',
      'flag': '🇺🇸',
    },
    'UK': {
      'name': 'United Kingdom',
      'currency': 'GBP',
      'symbol': '£',
      'flag': '🇬🇧',
    },
  };

  static Future<String> getSelectedCountry() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_countryKey) ?? 'NZ'; // Default to New Zealand
  }

  static Future<void> setSelectedCountry(String countryCode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_countryKey, countryCode);
    
    // Also save the currency
    final currency = supportedCountries[countryCode]?['currency'] ?? 'NZD';
    await prefs.setString(_currencyKey, currency);
  }

  static Future<String> getSelectedCurrency() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_currencyKey) ?? 'NZD';
  }

  static String getCurrencySymbol(String countryCode) {
    return supportedCountries[countryCode]?['symbol'] ?? '\$';
  }

  static String getCountryName(String countryCode) {
    return supportedCountries[countryCode]?['name'] ?? 'Unknown';
  }

  static String getCountryFlag(String countryCode) {
    return supportedCountries[countryCode]?['flag'] ?? '🌍';
  }

  static List<String> getSupportedCountryCodes() {
    return supportedCountries.keys.toList();
  }

  static bool isCountrySupported(String countryCode) {
    return supportedCountries.containsKey(countryCode);
  }
}
