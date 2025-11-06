import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import '../widgets/neumorphic_container.dart';
import '../theme/app_theme.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'All';
  
  final List<String> _categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snacks',
    'Healthy',
    'Quick',
  ];

  final List<Map<String, dynamic>> _featuredRecipes = [
    {
      'id': '1',
      'title': 'Tesla Energy Bowl',
      'description': 'Supercharged quinoa bowl with avocado and hemp seeds',
      'cookTime': '15 min',
      'difficulty': 'Easy',
      'rating': 4.8,
      'image': 'assets/images/energy_bowl.jpg',
      'category': 'Healthy',
      'calories': 420,
    },
    {
      'id': '2',
      'title': 'Cybertruck Burger',
      'description': 'Futuristic plant-based burger with special sauce',
      'cookTime': '25 min',
      'difficulty': 'Medium',
      'rating': 4.9,
      'image': 'assets/images/cyber_burger.jpg',
      'category': 'Lunch',
      'calories': 580,
    },
    {
      'id': '3',
      'title': 'Starship Smoothie',
      'description': 'Galaxy-inspired smoothie with blue spirulina',
      'cookTime': '5 min',
      'difficulty': 'Easy',
      'rating': 4.7,
      'image': 'assets/images/starship_smoothie.jpg',
      'category': 'Breakfast',
      'calories': 280,
    },
    {
      'id': '4',
      'title': 'Model S Salad',
      'description': 'Sleek and sophisticated Mediterranean salad',
      'cookTime': '10 min',
      'difficulty': 'Easy',
      'rating': 4.6,
      'image': 'assets/images/model_s_salad.jpg',
      'category': 'Healthy',
      'calories': 320,
    },
  ];

  List<Map<String, dynamic>> get _filteredRecipes {
    if (_selectedCategory == 'All') {
      return _featuredRecipes;
    }
    return _featuredRecipes
        .where((recipe) => recipe['category'] == _selectedCategory)
        .toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search Bar
          _buildSearchBar(),
          const SizedBox(height: 24),
          
          // Categories
          _buildCategories(),
          const SizedBox(height: 24),
          
          // Featured Section
          Text(
            'Featured Recipes',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
          const SizedBox(height: 16),
          
          // Recipe Grid
          Expanded(
            child: _buildRecipeGrid(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return NeumorphicContainer(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      borderRadius: 25,
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Search recipes, ingredients...',
          hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
          ),
          border: InputBorder.none,
          prefixIcon: Icon(
            Icons.search,
            color: Theme.of(context).colorScheme.primary,
          ),
          suffixIcon: IconButton(
            icon: Icon(
              Icons.tune,
              color: Theme.of(context).colorScheme.primary,
            ),
            onPressed: () {
              // TODO: Show filter options
            },
          ),
        ),
        style: Theme.of(context).textTheme.bodyLarge,
      ),
    ).animate().fadeIn(duration: 600.ms).slideY(begin: -0.2);
  }

  Widget _buildCategories() {
    return SizedBox(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final category = _categories[index];
          final isSelected = category == _selectedCategory;
          
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              horizontalOffset: 50.0,
              child: FadeInAnimation(
                child: Container(
                  margin: const EdgeInsets.only(right: 12),
                  child: NeumorphicButton(
                    onPressed: () {
                      setState(() {
                        _selectedCategory = category;
                      });
                    },
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    borderRadius: 25,
                    gradient: isSelected ? AppTheme.primaryGradient : null,
                    backgroundColor: isSelected ? null : Colors.transparent,
                    child: Text(
                      category,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: isSelected
                            ? Colors.white
                            : Theme.of(context).colorScheme.onSurface,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRecipeGrid() {
    return AnimationLimiter(
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 0.75,
        ),
        itemCount: _filteredRecipes.length,
        itemBuilder: (context, index) {
          final recipe = _filteredRecipes[index];
          
          return AnimationConfiguration.staggeredGrid(
            position: index,
            duration: const Duration(milliseconds: 375),
            columnCount: 2,
            child: ScaleAnimation(
              child: FadeInAnimation(
                child: _buildRecipeCard(recipe),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRecipeCard(Map<String, dynamic> recipe) {
    return NeumorphicCard(
      onTap: () {
        // TODO: Navigate to recipe detail
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Recipe Image
          Expanded(
            flex: 3,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: AppTheme.primaryGradient,
              ),
              child: Center(
                child: Icon(
                  Icons.restaurant,
                  size: 48,
                  color: Colors.white.withOpacity(0.8),
                ),
              ),
            ),
          ),
          
          const SizedBox(height: 12),
          
          // Recipe Info
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  recipe['title'],
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                
                Text(
                  recipe['description'],
                  style: Theme.of(context).textTheme.bodySmall,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                
                const Spacer(),
                
                // Recipe Stats
                Row(
                  children: [
                    Icon(
                      Icons.access_time,
                      size: 14,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      recipe['cookTime'],
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const Spacer(),
                    Icon(
                      Icons.star,
                      size: 14,
                      color: Colors.amber,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      recipe['rating'].toString(),
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

