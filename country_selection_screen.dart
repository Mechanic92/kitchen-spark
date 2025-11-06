import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../services/country_service.dart';
import '../theme/app_theme.dart';
import '../widgets/neumorphic_container.dart';

class CountrySelectionScreen extends StatefulWidget {
  const CountrySelectionScreen({Key? key}) : super(key: key);

  @override
  State<CountrySelectionScreen> createState() => _CountrySelectionScreenState();
}

class _CountrySelectionScreenState extends State<CountrySelectionScreen> {
  String? selectedCountry;

  @override
  void initState() {
    super.initState();
    _loadSelectedCountry();
  }

  Future<void> _loadSelectedCountry() async {
    final country = await CountryService.getSelectedCountry();
    setState(() {
      selectedCountry = country;
    });
  }

  Future<void> _selectCountry(String countryCode) async {
    await CountryService.setSelectedCountry(countryCode);
    setState(() {
      selectedCountry = countryCode;
    });
    
    // Update app state
    if (mounted) {
      Provider.of<AppState>(context, listen: false).setSelectedCountry(countryCode);
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text(
          'Select Country',
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Choose your country to get localized pricing and supermarket information:',
              style: TextStyle(
                color: AppTheme.textColor,
                fontSize: 16,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 30),
            Expanded(
              child: ListView.builder(
                itemCount: CountryService.getSupportedCountryCodes().length,
                itemBuilder: (context, index) {
                  final countryCode = CountryService.getSupportedCountryCodes()[index];
                  final countryName = CountryService.getCountryName(countryCode);
                  final countryFlag = CountryService.getCountryFlag(countryCode);
                  final currencySymbol = CountryService.getCurrencySymbol(countryCode);
                  final isSelected = selectedCountry == countryCode;

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: NeumorphicContainer(
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 10,
                        ),
                        leading: Text(
                          countryFlag,
                          style: const TextStyle(fontSize: 32),
                        ),
                        title: Text(
                          countryName,
                          style: TextStyle(
                            color: AppTheme.textColor,
                            fontSize: 18,
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                          ),
                        ),
                        subtitle: Text(
                          'Currency: $currencySymbol',
                          style: TextStyle(
                            color: AppTheme.textColor.withOpacity(0.7),
                            fontSize: 14,
                          ),
                        ),
                        trailing: isSelected
                            ? Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppTheme.accentColor,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Icon(
                                  Icons.check,
                                  color: Colors.white,
                                  size: 20,
                                ),
                              )
                            : null,
                        onTap: () => _selectCountry(countryCode),
                      ),
                    ),
                  );
                },
              ),
            ),
            if (selectedCountry != null) ...[
              const SizedBox(height: 20),
              NeumorphicContainer(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Selected: ${CountryService.getCountryFlag(selectedCountry!)} ${CountryService.getCountryName(selectedCountry!)}',
                        style: const TextStyle(
                          color: AppTheme.textColor,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'You will see prices in ${CountryService.getCurrencySymbol(selectedCountry!)} and supermarkets available in this region.',
                        style: TextStyle(
                          color: AppTheme.textColor.withOpacity(0.7),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
