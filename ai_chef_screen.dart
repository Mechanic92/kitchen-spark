import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../widgets/neumorphic_container.dart';
import '../theme/app_theme.dart';

class AiChefScreen extends StatefulWidget {
  const AiChefScreen({super.key});

  @override
  State<AiChefScreen> createState() => _AiChefScreenState();
}

class _AiChefScreenState extends State<AiChefScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<Map<String, dynamic>> _messages = [];
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    _addWelcomeMessage();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _addWelcomeMessage() {
    setState(() {
      _messages.add({
        'text': 'Hello! I\'m your AI Chef assistant. I can help you with recipes, cooking tips, ingredient substitutions, and meal planning. What would you like to cook today?',
        'isUser': false,
        'timestamp': DateTime.now(),
      });
    });
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    final userMessage = _messageController.text.trim();
    setState(() {
      _messages.add({
        'text': userMessage,
        'isUser': true,
        'timestamp': DateTime.now(),
      });
      _isTyping = true;
    });

    _messageController.clear();
    _scrollToBottom();

    // Simulate AI response
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _messages.add({
          'text': _generateAiResponse(userMessage),
          'isUser': false,
          'timestamp': DateTime.now(),
        });
        _isTyping = false;
      });
      _scrollToBottom();
    });
  }

  String _generateAiResponse(String userMessage) {
    final message = userMessage.toLowerCase();
    
    if (message.contains('recipe') || message.contains('cook')) {
      return 'I\'d love to help you with a recipe! What type of cuisine or ingredients do you have in mind? I can suggest something based on your preferences, dietary restrictions, or available ingredients.';
    } else if (message.contains('ingredient') || message.contains('substitute')) {
      return 'Great question about ingredients! I can help you find substitutes for almost any ingredient. What specific ingredient are you looking to replace, and I\'ll give you the best alternatives.';
    } else if (message.contains('healthy') || message.contains('diet')) {
      return 'I\'m here to help with healthy cooking! Whether you\'re looking for low-carb, vegetarian, vegan, or any other dietary preference, I can suggest nutritious and delicious recipes that fit your needs.';
    } else if (message.contains('quick') || message.contains('fast')) {
      return 'Need something quick? I have plenty of fast and easy recipes that take 30 minutes or less. What type of meal are you looking for - breakfast, lunch, dinner, or a snack?';
    } else {
      return 'That\'s interesting! I\'m here to help with all your cooking needs. Feel free to ask me about recipes, cooking techniques, ingredient substitutions, meal planning, or any culinary questions you have.';
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          // Header
          _buildHeader(),
          const SizedBox(height: 24),
          
          // Chat Messages
          Expanded(
            child: _buildChatArea(),
          ),
          
          const SizedBox(height: 16),
          
          // Message Input
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        NeumorphicContainer(
          width: 60,
          height: 60,
          borderRadius: 30,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(26),
              gradient: AppTheme.accentGradient,
            ),
            child: const Icon(
              Icons.smart_toy,
              size: 28,
              color: Colors.white,
            ),
          ),
        ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
        
        const SizedBox(width: 16),
        
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'AI Chef Assistant',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ).animate().fadeIn(duration: 600.ms).slideX(begin: -0.2),
              
              Text(
                'Your personal cooking companion',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                ),
              ).animate().fadeIn(delay: 200.ms, duration: 600.ms),
            ],
          ),
        ),
        
        NeumorphicContainer(
          borderRadius: 20,
          padding: const EdgeInsets.all(12),
          onTap: () {
            // TODO: Clear chat or settings
          },
          child: Icon(
            Icons.more_vert,
            color: Theme.of(context).colorScheme.primary,
          ),
        ).animate().fadeIn(delay: 400.ms, duration: 600.ms).scale(begin: const Offset(0.8, 0.8)),
      ],
    );
  }

  Widget _buildChatArea() {
    return NeumorphicContainer(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isTyping) {
                  return _buildTypingIndicator();
                }
                
                final message = _messages[index];
                return _buildMessageBubble(message, index);
              },
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 800.ms).slideY(begin: 0.1);
  }

  Widget _buildMessageBubble(Map<String, dynamic> message, int index) {
    final isUser = message['isUser'] as bool;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: AppTheme.accentGradient,
              ),
              child: const Icon(
                Icons.smart_toy,
                size: 16,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 8),
          ],
          
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: isUser ? AppTheme.primaryGradient : null,
                color: isUser ? null : Theme.of(context).colorScheme.surface.withOpacity(0.5),
              ),
              child: Text(
                message['text'],
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: isUser ? Colors.white : Theme.of(context).colorScheme.onSurface,
                ),
              ),
            ),
          ),
          
          if (isUser) ...[
            const SizedBox(width: 8),
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: AppTheme.primaryGradient,
              ),
              child: const Icon(
                Icons.person,
                size: 16,
                color: Colors.white,
              ),
            ),
          ],
        ],
      ),
    ).animate().fadeIn(duration: 400.ms).slideX(
      begin: isUser ? 0.2 : -0.2,
      delay: Duration(milliseconds: index * 100),
    );
  }

  Widget _buildTypingIndicator() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: AppTheme.accentGradient,
            ),
            child: const Icon(
              Icons.smart_toy,
              size: 16,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 8),
          
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: Theme.of(context).colorScheme.surface.withOpacity(0.5),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTypingDot(0),
                const SizedBox(width: 4),
                _buildTypingDot(200),
                const SizedBox(width: 4),
                _buildTypingDot(400),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypingDot(int delay) {
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4),
        color: Theme.of(context).colorScheme.primary,
      ),
    ).animate(onPlay: (controller) => controller.repeat())
        .fadeIn(duration: 600.ms, delay: Duration(milliseconds: delay))
        .then(delay: 200.ms)
        .fadeOut(duration: 600.ms);
  }

  Widget _buildMessageInput() {
    return Row(
      children: [
        Expanded(
          child: NeumorphicContainer(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            borderRadius: 25,
            child: TextField(
              controller: _messageController,
              decoration: InputDecoration(
                hintText: 'Ask me anything about cooking...',
                hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
                ),
                border: InputBorder.none,
              ),
              style: Theme.of(context).textTheme.bodyLarge,
              maxLines: null,
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => _sendMessage(),
            ),
          ),
        ),
        
        const SizedBox(width: 12),
        
        NeumorphicContainer(
          width: 56,
          height: 56,
          borderRadius: 28,
          onTap: _sendMessage,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              gradient: AppTheme.primaryGradient,
            ),
            child: const Icon(
              Icons.send,
              color: Colors.white,
              size: 24,
            ),
          ),
        ),
      ],
    ).animate().slideY(begin: 1, duration: 800.ms, curve: Curves.easeOutBack);
  }
}

