# Kitchen Spark Mobile App

A modern, Tesla-inspired mobile application for culinary enthusiasts, built with Flutter and featuring neumorphic design elements and 3D immersive styling.

## 🚀 Features

### 🔐 Authentication System
- Secure user registration and login
- JWT token-based authentication
- Persistent login state
- Password validation and security

### 🍳 Recipe Discovery
- Browse featured recipes with Tesla-style naming (Tesla Energy Bowl, Cybertruck Burger, etc.)
- Category-based filtering (Breakfast, Lunch, Dinner, Healthy, etc.)
- Advanced search functionality
- Recipe ratings and difficulty indicators
- Beautiful neumorphic card design

### 🤖 AI Chef Assistant
- Interactive chat interface with cooking AI
- Personalized recipe suggestions
- Cooking tips and techniques
- Ingredient substitution advice
- Real-time typing indicators
- Contextual and intelligent responses

### 🛒 Smart Shopping List
- Add/remove items with smooth neumorphic interactions
- Quick-add suggestions for common ingredients
- Progress tracking with completion status
- Category organization
- Offline functionality with automatic sync

### 📊 Progress & Gamification
- User level system: Kitchen Newbie → Cooking Apprentice → Kitchen Explorer → Culinary Artist → Master Chef
- Spark Points reward system (earn points for activities)
- Achievement badges and milestones
- Activity tracking and statistics
- Beautiful progress dashboard

### 🎨 Modern UI/UX Design
- Tesla-inspired neumorphic design language
- Smooth animations and micro-interactions
- 3D visual effects and depth
- Glassmorphic elements
- Dark/light theme support
- Fully responsive design for all screen sizes

## 🛠 Technology Stack

- **Framework**: Flutter 3.24.5+
- **State Management**: Provider
- **Backend Integration**: REST API with JWT authentication
- **Local Storage**: SharedPreferences
- **Animations**: flutter_animate, flutter_staggered_animations
- **UI Effects**: glassmorphism, custom neumorphic components
- **Typography**: Google Fonts (Inter)
- **HTTP Client**: http package
- **Image Handling**: image_picker

## 🏗 Architecture

The app follows a clean architecture pattern with clear separation of concerns:

```
lib/
├── main.dart                 # App entry point and initialization
├── providers/               # State management
│   └── app_state.dart      # Global application state
├── screens/                # UI screens
│   ├── auth_screen.dart    # Authentication (login/register)
│   ├── home_screen.dart    # Main navigation hub
│   ├── discover_screen.dart # Recipe discovery and browsing
│   ├── saved_recipes_screen.dart # User's saved recipes
│   ├── ai_chef_screen.dart # AI chat interface
│   ├── shopping_screen.dart # Smart shopping list
│   └── progress_screen.dart # Progress tracking and gamification
├── widgets/                # Reusable UI components
│   └── neumorphic_container.dart # Custom neumorphic widgets
├── services/               # Business logic and API
│   ├── api_service.dart    # Backend API integration
│   └── auth_service.dart   # Authentication service
└── theme/                  # Design system
    └── app_theme.dart      # Tesla-inspired theme configuration
```

## 🔧 Setup and Installation

### Prerequisites
- Flutter SDK 3.24.5 or later
- Android Studio with Android SDK (API level 21+)
- Java 17 (OpenJDK)
- For iOS: Xcode 15+ and iOS 12+

### Installation Steps

1. **Install dependencies**
   ```bash
   flutter pub get
   ```

2. **Configure backend URL**
   Update the API endpoint in `lib/services/api_service.dart`:
   ```dart
   static const String baseUrl = 'https://your-backend-url.com';
   ```

3. **Run the app**
   ```bash
   # For development
   flutter run
   
   # For release build
   flutter build apk --release
   ```

## 🌐 Backend Integration

The app integrates with a Flask backend providing comprehensive API endpoints for authentication, recipes, user management, shopping lists, and AI chat functionality.

## 🎯 Key Features Explained

### Neumorphic Design
The app implements a custom neumorphic design system inspired by Tesla's interface design with soft shadows, highlights, and interactive elements.

### Tesla-Style Branding
- Recipe names inspired by Tesla products (Model S Salad, Starship Smoothie)
- Color palette matching Tesla's design language
- Clean, minimalist interface with focus on functionality
- Premium feel with attention to detail

### Gamification System
- **Spark Points**: Earned through app engagement
- **Level Progression**: Visual representation of cooking skill advancement
- **Achievements**: Unlock badges for various milestones
- **Progress Tracking**: Statistics and activity history

## 📦 Building for Production

### Android APK
```bash
flutter build apk --release
```

### iOS App Bundle
```bash
flutter build ios --release
```

## 📄 Documentation

For detailed build instructions, API documentation, and troubleshooting, see:
- `build_instructions.md` - Comprehensive build and deployment guide
- `lib/services/api_service.dart` - API endpoint documentation
- `lib/theme/app_theme.dart` - Design system documentation

## 📞 Support

For support and questions, check the documentation files or contact the development team.

---

**Kitchen Spark** - *Ignite Your Inner Chef* 🔥👨‍🍳
