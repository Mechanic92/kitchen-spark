import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import '../providers/app_state.dart';
import '../widgets/neumorphic_container.dart';
import '../theme/app_theme.dart';

class SavedRecipesScreen extends StatelessWidget {
  const SavedRecipesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Saved Recipes',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
                  ),
                  NeumorphicContainer(
                    borderRadius: 20,
                    padding: const EdgeInsets.all(12),
                    onTap: () {
                      // TODO: Sort/filter options
                    },
                    child: Icon(
                      Icons.sort,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ).animate().fadeIn(delay: 300.ms, duration: 600.ms).scale(begin: const Offset(0.8, 0.8)),
                ],
              ),
              
              const SizedBox(height: 8),
              
              Text(
                '${appState.savedRecipes.length} recipes saved',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                ),
              ).animate().fadeIn(delay: 200.ms, duration: 600.ms),
              
              const SizedBox(height: 24),
              
              // Content
              Expanded(
                child: appState.savedRecipes.isEmpty
                    ? _buildEmptyState(context)
                    : _buildRecipesList(context, appState.savedRecipes),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          NeumorphicContainer(
            width: 120,
            height: 120,
            borderRadius: 60,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(56),
                gradient: AppTheme.primaryGradient.scale(0.3),
              ),
              child: const Icon(
                Icons.bookmark_outline,
                size: 48,
                color: Colors.white,
              ),
            ),
          ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
          
          const SizedBox(height: 32),
          
          Text(
            'No Saved Recipes Yet',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ).animate().fadeIn(delay: 400.ms, duration: 600.ms),
          
          const SizedBox(height: 12),
          
          Text(
            'Start exploring recipes and save your favorites to see them here!',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
            ),
            textAlign: TextAlign.center,
          ).animate().fadeIn(delay: 600.ms, duration: 600.ms),
          
          const SizedBox(height: 32),
          
          NeumorphicButton(
            onPressed: () {
              // TODO: Navigate to discover screen
              final appState = Provider.of<AppState>(context, listen: false);
              appState.setCurrentIndex(0);
            },
            gradient: AppTheme.primaryGradient,
            child: Text(
              'Discover Recipes',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ).animate().fadeIn(delay: 800.ms, duration: 600.ms).slideY(begin: 0.2),
        ],
      ),
    );
  }

  Widget _buildRecipesList(BuildContext context, List<Map<String, dynamic>> recipes) {
    return AnimationLimiter(
      child: ListView.builder(
        itemCount: recipes.length,
        itemBuilder: (context, index) {
          final recipe = recipes[index];
          
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              verticalOffset: 50.0,
              child: FadeInAnimation(
                child: Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: _buildRecipeCard(context, recipe),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRecipeCard(BuildContext context, Map<String, dynamic> recipe) {
    return NeumorphicCard(
      onTap: () {
        // TODO: Navigate to recipe detail
      },
      child: Row(
        children: [
          // Recipe Image
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: AppTheme.primaryGradient,
            ),
            child: Center(
              child: Icon(
                Icons.restaurant,
                size: 32,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
          ),
          
          const SizedBox(width: 16),
          
          // Recipe Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  recipe['title'] ?? 'Untitled Recipe',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                
                const SizedBox(height: 4),
                
                Text(
                  recipe['description'] ?? 'No description available',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                
                const SizedBox(height: 8),
                
                // Recipe Stats
                Row(
                  children: [
                    if (recipe['cookTime'] != null) ...[
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
                      const SizedBox(width: 16),
                    ],
                    
                    if (recipe['rating'] != null) ...[
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
                  ],
                ),
              ],
            ),
          ),
          
          // Actions
          Column(
            children: [
              NeumorphicContainer(
                width: 40,
                height: 40,
                borderRadius: 20,
                padding: const EdgeInsets.all(8),
                onTap: () {
                  // TODO: Share recipe
                },
                child: Icon(
                  Icons.share_outlined,
                  size: 16,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              
              const SizedBox(height: 8),
              
              NeumorphicContainer(
                width: 40,
                height: 40,
                borderRadius: 20,
                padding: const EdgeInsets.all(8),
                onTap: () {
                  final appState = Provider.of<AppState>(context, listen: false);
                  appState.removeSavedRecipe(recipe['id']);
                },
                child: Icon(
                  Icons.delete_outline,
                  size: 16,
                  color: Colors.red.shade400,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

