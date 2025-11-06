import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../services/supermarket_service.dart';
import '../services/country_service.dart';
import '../theme/app_theme.dart';
import '../widgets/neumorphic_container.dart';

class PriceComparisonScreen extends StatefulWidget {
  final String? initialSearchTerm;
  
  const PriceComparisonScreen({Key? key, this.initialSearchTerm}) : super(key: key);

  @override
  State<PriceComparisonScreen> createState() => _PriceComparisonScreenState();
}

class _PriceComparisonScreenState extends State<PriceComparisonScreen> {
  final TextEditingController _searchController = TextEditingController();
  Map<String, List<Product>> _comparisonResults = {};
  bool _isLoading = false;
  String _selectedCountry = 'NZ';

  @override
  void initState() {
    super.initState();
    if (widget.initialSearchTerm != null) {
      _searchController.text = widget.initialSearchTerm!;
    }
    _loadSelectedCountry();
  }

  Future<void> _loadSelectedCountry() async {
    final country = await CountryService.getSelectedCountry();
    setState(() {
      _selectedCountry = country;
    });
    
    if (widget.initialSearchTerm != null) {
      _performComparison();
    }
  }

  Future<void> _performComparison() async {
    if (_searchController.text.trim().isEmpty) return;

    setState(() {
      _isLoading = true;
      _comparisonResults = {};
    });

    try {
      final results = await SupermarketService.compareProductPrices(
        _searchController.text.trim(),
        _selectedCountry,
      );
      
      setState(() {
        _comparisonResults = results;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error comparing prices: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Widget _buildComparisonCard(String supermarket, List<Product> products) {
    final currencySymbol = CountryService.getCurrencySymbol(_selectedCountry);
    
    return NeumorphicContainer(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.accentColor,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    supermarket,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  '${products.length} items',
                  style: TextStyle(
                    color: AppTheme.textColor.withOpacity(0.6),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (products.isEmpty)
              Text(
                'No products found',
                style: TextStyle(
                  color: AppTheme.textColor.withOpacity(0.6),
                  fontStyle: FontStyle.italic,
                ),
              )
            else
              ...products.map((product) => Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product.name,
                            style: const TextStyle(
                              color: AppTheme.textColor,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            'per ${product.unit}',
                            style: TextStyle(
                              color: AppTheme.textColor.withOpacity(0.6),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '$currencySymbol${product.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: AppTheme.accentColor,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              )).toList(),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text(
          'Price Comparison',
          style: TextStyle(
            color: AppTheme.textColor,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: AppTheme.backgroundColor,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppTheme.textColor),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            NeumorphicContainer(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _searchController,
                        style: const TextStyle(color: AppTheme.textColor),
                        decoration: const InputDecoration(
                          hintText: 'Search for products to compare...',
                          hintStyle: TextStyle(color: AppTheme.hintColor),
                          border: InputBorder.none,
                          icon: Icon(Icons.search, color: AppTheme.accentColor),
                        ),
                        onSubmitted: (_) => _performComparison(),
                      ),
                    ),
                    IconButton(
                      onPressed: _performComparison,
                      icon: const Icon(Icons.compare_arrows, color: AppTheme.accentColor),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Text(
                  CountryService.getCountryFlag(_selectedCountry),
                  style: const TextStyle(fontSize: 20),
                ),
                const SizedBox(width: 8),
                Text(
                  'Comparing prices in ${CountryService.getCountryName(_selectedCountry)}',
                  style: TextStyle(
                    color: AppTheme.textColor.withOpacity(0.7),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(AppTheme.accentColor),
                      ),
                    )
                  : _comparisonResults.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.search,
                                size: 64,
                                color: AppTheme.textColor.withOpacity(0.3),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Enter a product name to compare prices\nacross different supermarkets',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: AppTheme.textColor.withOpacity(0.6),
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          itemCount: _comparisonResults.length,
                          itemBuilder: (context, index) {
                            final supermarket = _comparisonResults.keys.elementAt(index);
                            final products = _comparisonResults[supermarket]!;
                            
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 16.0),
                              child: _buildComparisonCard(supermarket, products),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
