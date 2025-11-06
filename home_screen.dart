import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/app_state.dart';
import '../widgets/neumorphic_container.dart';
import '../theme/app_theme.dart';
import 'discover_screen.dart';
import 'saved_recipes_screen.dart';
import 'ai_chef_screen.dart';
import 'shopping_screen.dart';
import 'progress_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PageController _pageController = PageController();

  final List<Widget> _screens = [
    const DiscoverScreen(),
    const SavedRecipesScreen(),
    const AiChefScreen(),
    const ShoppingScreen(),
    const ProgressScreen(),
  ];

  final List<IconData> _icons = [
    Icons.explore_outlined,
    Icons.bookmark_outline,
    Icons.smart_toy_outlined,
    Icons.shopping_cart_outlined,
    Icons.trending_up_outlined,
  ];

  final List<IconData> _selectedIcons = [
    Icons.explore,
    Icons.bookmark,
    Icons.smart_toy,
    Icons.shopping_cart,
    Icons.trending_up,
  ];

  final List<String> _labels = [
    'Discover',
    'Saved',
    'AI Chef',
    'Shopping',
    'Progress',
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onTabTapped(int index) {
    final appState = Provider.of<AppState>(context, listen: false);
    appState.setCurrentIndex(index);
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        return Scaffold(
          body: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Theme.of(context).colorScheme.background,
                  Theme.of(context).colorScheme.surface,
                ],
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  // Custom App Bar
                  _buildAppBar(context, appState),
                  
                  // Page Content
                  Expanded(
                    child: PageView(
                      controller: _pageController,
                      onPageChanged: (index) {
                        appState.setCurrentIndex(index);
                      },
                      children: _screens,
                    ),
                  ),
                  
                  // Custom Bottom Navigation
                  _buildBottomNavigation(context, appState),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAppBar(BuildContext context, AppState appState) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          // Logo/Title
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Kitchen Spark',
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    background: Paint()
                      ..shader = AppTheme.primaryGradient.createShader(
                        const Rect.fromLTWH(0, 0, 200, 70),
                      ),
                  ),
                ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
                if (appState.isLoggedIn)
                  Text(
                    'Welcome back, ${appState.userName}!',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ).animate().fadeIn(delay: 300.ms, duration: 600.ms),
              ],
            ),
          ),
          
          // User Profile/Settings
          NeumorphicContainer(
            borderRadius: 25,
            padding: const EdgeInsets.all(12),
            onTap: () {
              // TODO: Navigate to profile/settings
            },
            child: Icon(
              appState.isLoggedIn ? Icons.person : Icons.person_outline,
              size: 24,
              color: Theme.of(context).colorScheme.primary,
            ),
          ).animate().fadeIn(delay: 600.ms, duration: 600.ms).scale(begin: const Offset(0.8, 0.8)),
        ],
      ),
    );
  }

  Widget _buildBottomNavigation(BuildContext context, AppState appState) {
    return Container(
      margin: const EdgeInsets.all(20),
      child: NeumorphicContainer(
        height: 80,
        borderRadius: 25,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: List.generate(_screens.length, (index) {
            final isSelected = appState.currentIndex == index;
            return Expanded(
              child: GestureDetector(
                onTap: () => _onTabTapped(index),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: isSelected ? AppTheme.primaryGradient : null,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isSelected ? _selectedIcons[index] : _icons[index],
                        color: isSelected
                            ? Colors.white
                            : Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                        size: 24,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _labels[index],
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: isSelected
                              ? Colors.white
                              : Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ),
      ),
    ).animate().slideY(begin: 1, duration: 800.ms, curve: Curves.easeOutBack);
  }
}

