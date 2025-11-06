import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import '../providers/app_state.dart';
import '../widgets/neumorphic_container.dart';
import '../theme/app_theme.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

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
              Text(
                'Your Progress',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
              
              const SizedBox(height: 8),
              
              Text(
                'Track your culinary journey',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                ),
              ).animate().fadeIn(delay: 200.ms, duration: 600.ms),
              
              const SizedBox(height: 32),
              
              // Content
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      // User Level Card
                      _buildUserLevelCard(context, appState),
                      const SizedBox(height: 24),
                      
                      // Stats Grid
                      _buildStatsGrid(context, appState),
                      const SizedBox(height: 24),
                      
                      // Achievements
                      _buildAchievements(context, appState),
                      const SizedBox(height: 24),
                      
                      // Recent Activity
                      _buildRecentActivity(context, appState),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildUserLevelCard(BuildContext context, AppState appState) {
    final currentLevel = appState.userLevel;
    final nextLevelPoints = _getPointsForLevel(currentLevel + 1);
    final currentLevelPoints = _getPointsForLevel(currentLevel);
    final progress = nextLevelPoints > 0 
        ? (appState.sparkPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)
        : 1.0;

    return NeumorphicCard(
      child: Column(
        children: [
          // Level Badge
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(50),
              gradient: AppTheme.primaryGradient,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'LV',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  currentLevel.toString(),
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
          
          const SizedBox(height: 16),
          
          // Level Title
          Text(
            appState.userLevelTitle,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ).animate().fadeIn(delay: 400.ms, duration: 600.ms),
          
          const SizedBox(height: 8),
          
          // Spark Points
          Text(
            '${appState.sparkPoints} Spark Points',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Theme.of(context).colorScheme.primary,
              fontWeight: FontWeight.w600,
            ),
          ).animate().fadeIn(delay: 600.ms, duration: 600.ms),
          
          const SizedBox(height: 16),
          
          // Progress Bar
          if (currentLevel < 5) ...[
            Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Progress to Level ${currentLevel + 1}',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    Text(
                      '${((progress * 100).clamp(0, 100)).toInt()}%',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                NeumorphicContainer(
                  height: 12,
                  borderRadius: 6,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(6),
                      color: Theme.of(context).colorScheme.surface,
                    ),
                    child: FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: progress.clamp(0.0, 1.0),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6),
                          gradient: AppTheme.accentGradient,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ).animate().fadeIn(delay: 800.ms, duration: 600.ms),
          ] else ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: AppTheme.accentGradient.scale(0.3),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.star,
                    color: Colors.amber,
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Max Level Reached!',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(delay: 800.ms, duration: 600.ms).scale(begin: const Offset(0.8, 0.8)),
          ],
        ],
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context, AppState appState) {
    final stats = [
      {
        'title': 'Recipes Saved',
        'value': appState.savedRecipes.length.toString(),
        'icon': Icons.bookmark,
        'color': AppTheme.primaryBlue,
      },
      {
        'title': 'Shopping Items',
        'value': appState.shoppingList.length.toString(),
        'icon': Icons.shopping_cart,
        'color': AppTheme.accentGreen,
      },
      {
        'title': 'Cooking Streak',
        'value': '7 days', // TODO: Implement streak tracking
        'icon': Icons.local_fire_department,
        'color': Colors.orange,
      },
      {
        'title': 'Achievements',
        'value': _getUnlockedAchievements(appState).length.toString(),
        'icon': Icons.emoji_events,
        'color': Colors.amber,
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.2,
      ),
      itemCount: stats.length,
      itemBuilder: (context, index) {
        final stat = stats[index];
        
        return AnimationConfiguration.staggeredGrid(
          position: index,
          duration: const Duration(milliseconds: 375),
          columnCount: 2,
          child: ScaleAnimation(
            child: FadeInAnimation(
              child: NeumorphicCard(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        color: (stat['color'] as Color).withOpacity(0.1),
                      ),
                      child: Icon(
                        stat['icon'] as IconData,
                        color: stat['color'] as Color,
                        size: 24,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      stat['value'] as String,
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: stat['color'] as Color,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      stat['title'] as String,
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAchievements(BuildContext context, AppState appState) {
    final achievements = _getAllAchievements();
    final unlockedAchievements = _getUnlockedAchievements(appState);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Achievements',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
        
        const SizedBox(height: 16),
        
        SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: achievements.length,
            itemBuilder: (context, index) {
              final achievement = achievements[index];
              final isUnlocked = unlockedAchievements.contains(achievement['id']);
              
              return AnimationConfiguration.staggeredList(
                position: index,
                duration: const Duration(milliseconds: 375),
                child: SlideAnimation(
                  horizontalOffset: 50.0,
                  child: FadeInAnimation(
                    child: Container(
                      width: 100,
                      margin: const EdgeInsets.only(right: 16),
                      child: NeumorphicCard(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(24),
                                gradient: isUnlocked 
                                    ? AppTheme.accentGradient 
                                    : LinearGradient(
                                        colors: [
                                          Colors.grey.shade300,
                                          Colors.grey.shade400,
                                        ],
                                      ),
                              ),
                              child: Icon(
                                achievement['icon'] as IconData,
                                color: Colors.white,
                                size: 24,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              achievement['title'] as String,
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                fontWeight: FontWeight.w600,
                                color: isUnlocked 
                                    ? Theme.of(context).colorScheme.onSurface
                                    : Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
                              ),
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildRecentActivity(BuildContext context, AppState appState) {
    final activities = [
      {
        'title': 'Saved Tesla Energy Bowl',
        'subtitle': '2 hours ago',
        'icon': Icons.bookmark_add,
        'color': AppTheme.primaryBlue,
      },
      {
        'title': 'Completed shopping list',
        'subtitle': '1 day ago',
        'icon': Icons.check_circle,
        'color': AppTheme.accentGreen,
      },
      {
        'title': 'Earned 50 Spark Points',
        'subtitle': '2 days ago',
        'icon': Icons.star,
        'color': Colors.amber,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Activity',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
        
        const SizedBox(height: 16),
        
        ...activities.asMap().entries.map((entry) {
          final index = entry.key;
          final activity = entry.value;
          
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              verticalOffset: 50.0,
              child: FadeInAnimation(
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: NeumorphicCard(
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(24),
                            color: (activity['color'] as Color).withOpacity(0.1),
                          ),
                          child: Icon(
                            activity['icon'] as IconData,
                            color: activity['color'] as Color,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                activity['title'] as String,
                                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                activity['subtitle'] as String,
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ],
    );
  }

  int _getPointsForLevel(int level) {
    switch (level) {
      case 1: return 0;
      case 2: return 100;
      case 3: return 300;
      case 4: return 600;
      case 5: return 1000;
      default: return 1000;
    }
  }

  List<Map<String, dynamic>> _getAllAchievements() {
    return [
      {
        'id': 'first_recipe',
        'title': 'First Recipe',
        'description': 'Save your first recipe',
        'icon': Icons.bookmark_add,
        'requirement': 1,
      },
      {
        'id': 'recipe_collector',
        'title': 'Recipe Collector',
        'description': 'Save 10 recipes',
        'icon': Icons.collections_bookmark,
        'requirement': 10,
      },
      {
        'id': 'shopping_master',
        'title': 'Shopping Master',
        'description': 'Complete 5 shopping lists',
        'icon': Icons.shopping_cart_checkout,
        'requirement': 5,
      },
      {
        'id': 'spark_starter',
        'title': 'Spark Starter',
        'description': 'Earn 100 Spark Points',
        'icon': Icons.local_fire_department,
        'requirement': 100,
      },
      {
        'id': 'culinary_expert',
        'title': 'Culinary Expert',
        'description': 'Reach Level 5',
        'icon': Icons.emoji_events,
        'requirement': 5,
      },
    ];
  }

  List<String> _getUnlockedAchievements(AppState appState) {
    final unlocked = <String>[];
    
    if (appState.savedRecipes.isNotEmpty) {
      unlocked.add('first_recipe');
    }
    
    if (appState.savedRecipes.length >= 10) {
      unlocked.add('recipe_collector');
    }
    
    if (appState.sparkPoints >= 100) {
      unlocked.add('spark_starter');
    }
    
    if (appState.userLevel >= 5) {
      unlocked.add('culinary_expert');
    }
    
    return unlocked;
  }
}

