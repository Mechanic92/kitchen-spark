import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import '../providers/app_state.dart';
import '../widgets/neumorphic_container.dart';
import '../theme/app_theme.dart';

class ShoppingScreen extends StatefulWidget {
  const ShoppingScreen({super.key});

  @override
  State<ShoppingScreen> createState() => _ShoppingScreenState();
}

class _ShoppingScreenState extends State<ShoppingScreen> {
  final TextEditingController _itemController = TextEditingController();

  @override
  void dispose() {
    _itemController.dispose();
    super.dispose();
  }

  void _addItem(AppState appState) {
    if (_itemController.text.trim().isEmpty) return;

    final newItem = {
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'name': _itemController.text.trim(),
      'completed': false,
      'category': 'Other',
      'addedAt': DateTime.now(),
    };

    appState.addToShoppingList(newItem);
    _itemController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        final completedItems = appState.shoppingList.where((item) => item['completed'] == true).length;
        final totalItems = appState.shoppingList.length;

        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              _buildHeader(context, totalItems, completedItems),
              const SizedBox(height: 24),
              
              // Add Item Input
              _buildAddItemInput(appState),
              const SizedBox(height: 24),
              
              // Quick Add Suggestions
              _buildQuickAddSuggestions(appState),
              const SizedBox(height: 24),
              
              // Shopping List
              Expanded(
                child: appState.shoppingList.isEmpty
                    ? _buildEmptyState(context)
                    : _buildShoppingList(context, appState),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context, int totalItems, int completedItems) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Smart Shopping',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
            ),
            NeumorphicContainer(
              borderRadius: 20,
              padding: const EdgeInsets.all(12),
              onTap: () {
                final appState = Provider.of<AppState>(context, listen: false);
                appState.clearCompletedShoppingItems();
              },
              child: Icon(
                Icons.clear_all,
                color: Theme.of(context).colorScheme.primary,
              ),
            ).animate().fadeIn(delay: 300.ms, duration: 600.ms).scale(begin: const Offset(0.8, 0.8)),
          ],
        ),
        
        const SizedBox(height: 8),
        
        if (totalItems > 0)
          Row(
            children: [
              Text(
                '$completedItems of $totalItems items completed',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: NeumorphicContainer(
                  height: 8,
                  borderRadius: 4,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                      color: Theme.of(context).colorScheme.surface,
                    ),
                    child: FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: totalItems > 0 ? completedItems / totalItems : 0,
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(4),
                          gradient: AppTheme.accentGradient,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ).animate().fadeIn(delay: 200.ms, duration: 600.ms),
      ],
    );
  }

  Widget _buildAddItemInput(AppState appState) {
    return Row(
      children: [
        Expanded(
          child: NeumorphicContainer(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            borderRadius: 25,
            child: TextField(
              controller: _itemController,
              decoration: InputDecoration(
                hintText: 'Add item to shopping list...',
                hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
                ),
                border: InputBorder.none,
                prefixIcon: Icon(
                  Icons.add_shopping_cart,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              style: Theme.of(context).textTheme.bodyLarge,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => _addItem(appState),
            ),
          ),
        ),
        
        const SizedBox(width: 12),
        
        NeumorphicContainer(
          width: 56,
          height: 56,
          borderRadius: 28,
          onTap: () => _addItem(appState),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              gradient: AppTheme.primaryGradient,
            ),
            child: const Icon(
              Icons.add,
              color: Colors.white,
              size: 24,
            ),
          ),
        ),
      ],
    ).animate().fadeIn(duration: 600.ms).slideY(begin: -0.2);
  }

  Widget _buildQuickAddSuggestions(AppState appState) {
    final suggestions = [
      'Milk', 'Bread', 'Eggs', 'Chicken', 'Tomatoes', 'Onions', 'Rice', 'Pasta'
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Add',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
        
        const SizedBox(height: 12),
        
        SizedBox(
          height: 40,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: suggestions.length,
            itemBuilder: (context, index) {
              final suggestion = suggestions[index];
              
              return AnimationConfiguration.staggeredList(
                position: index,
                duration: const Duration(milliseconds: 375),
                child: SlideAnimation(
                  horizontalOffset: 50.0,
                  child: FadeInAnimation(
                    child: Container(
                      margin: const EdgeInsets.only(right: 8),
                      child: NeumorphicButton(
                        onPressed: () {
                          final newItem = {
                            'id': DateTime.now().millisecondsSinceEpoch.toString(),
                            'name': suggestion,
                            'completed': false,
                            'category': 'Quick Add',
                            'addedAt': DateTime.now(),
                          };
                          appState.addToShoppingList(newItem);
                        },
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        borderRadius: 20,
                        child: Text(
                          suggestion,
                          style: Theme.of(context).textTheme.bodyMedium,
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
                Icons.shopping_cart_outlined,
                size: 48,
                color: Colors.white,
              ),
            ),
          ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
          
          const SizedBox(height: 32),
          
          Text(
            'Your Shopping List is Empty',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ).animate().fadeIn(delay: 400.ms, duration: 600.ms),
          
          const SizedBox(height: 12),
          
          Text(
            'Add items to your shopping list to keep track of what you need to buy.',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
            ),
            textAlign: TextAlign.center,
          ).animate().fadeIn(delay: 600.ms, duration: 600.ms),
        ],
      ),
    );
  }

  Widget _buildShoppingList(BuildContext context, AppState appState) {
    final sortedItems = List<Map<String, dynamic>>.from(appState.shoppingList);
    sortedItems.sort((a, b) {
      if (a['completed'] != b['completed']) {
        return a['completed'] ? 1 : -1;
      }
      return (b['addedAt'] as DateTime).compareTo(a['addedAt'] as DateTime);
    });

    return AnimationLimiter(
      child: ListView.builder(
        itemCount: sortedItems.length,
        itemBuilder: (context, index) {
          final item = sortedItems[index];
          
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              verticalOffset: 50.0,
              child: FadeInAnimation(
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: _buildShoppingItem(context, appState, item),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildShoppingItem(BuildContext context, AppState appState, Map<String, dynamic> item) {
    final isCompleted = item['completed'] as bool;
    
    return NeumorphicCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Checkbox
          GestureDetector(
            onTap: () {
              appState.toggleShoppingListItem(item['id']);
            },
            child: NeumorphicContainer(
              width: 24,
              height: 24,
              borderRadius: 12,
              isPressed: isCompleted,
              child: isCompleted
                  ? Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        gradient: AppTheme.accentGradient,
                      ),
                      child: const Icon(
                        Icons.check,
                        size: 16,
                        color: Colors.white,
                      ),
                    )
                  : const SizedBox.shrink(),
            ),
          ),
          
          const SizedBox(width: 16),
          
          // Item Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['name'],
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w500,
                    decoration: isCompleted ? TextDecoration.lineThrough : null,
                    color: isCompleted
                        ? Theme.of(context).colorScheme.onSurface.withOpacity(0.5)
                        : Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                
                if (item['category'] != null)
                  Text(
                    item['category'],
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
              ],
            ),
          ),
          
          // Delete Button
          NeumorphicContainer(
            width: 40,
            height: 40,
            borderRadius: 20,
            padding: const EdgeInsets.all(8),
            onTap: () {
              appState.removeFromShoppingList(item['id']);
            },
            child: Icon(
              Icons.delete_outline,
              size: 16,
              color: Colors.red.shade400,
            ),
          ),
        ],
      ),
    );
  }
}

