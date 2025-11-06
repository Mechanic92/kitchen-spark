# Kitchen Spark Mobile App - Build Instructions

## Overview
This Flutter application provides a modern, Tesla-inspired mobile interface for the Kitchen Spark cooking platform with neumorphic design elements and 3D immersive styling.

## Prerequisites

### System Requirements
- Flutter SDK 3.24.5 or later
- Android Studio with Android SDK
- Java 17 (OpenJDK)
- Android NDK 27.0.12077973
- Minimum Android API level 21 (Android 5.0)
- For iOS: Xcode 15+ and iOS 12+

### Dependencies
The app uses the following key packages:
- `flutter_animate`: For smooth animations
- `flutter_staggered_animations`: For staggered list animations
- `glassmorphism`: For glassmorphic effects
- `google_fonts`: For Tesla-inspired typography
- `provider`: For state management
- `shared_preferences`: For local storage
- `http`: For API communication
- `image_picker`: For image selection
- `url_launcher`: For external links

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── providers/
│   └── app_state.dart       # Global state management
├── screens/
│   ├── auth_screen.dart     # Login/Registration
│   ├── home_screen.dart     # Main navigation
│   ├── discover_screen.dart # Recipe discovery
│   ├── saved_recipes_screen.dart # Saved recipes
│   ├── ai_chef_screen.dart  # AI chat interface
│   ├── shopping_screen.dart # Smart shopping list
│   └── progress_screen.dart # User progress & gamification
├── widgets/
│   └── neumorphic_container.dart # Neumorphic UI components
├── services/
│   ├── api_service.dart     # Backend API integration
│   └── auth_service.dart    # Authentication service
└── theme/
    └── app_theme.dart       # Tesla-inspired theme
```

## Features

### 1. Authentication System
- User registration and login
- JWT token-based authentication
- Persistent login state
- Password validation and security

### 2. Recipe Discovery
- Browse featured recipes with Tesla-style naming
- Category-based filtering
- Search functionality
- Recipe rating and difficulty display
- Neumorphic card design

### 3. AI Chef Assistant
- Interactive chat interface
- Recipe suggestions and cooking tips
- Ingredient substitution advice
- Real-time typing indicators
- Contextual responses

### 4. Smart Shopping List
- Add/remove items with neumorphic interactions
- Quick-add suggestions
- Progress tracking with completion status
- Category organization
- Offline functionality with sync

### 5. Progress & Gamification
- User level system (Kitchen Newbie to Master Chef)
- Spark Points reward system
- Achievement badges
- Activity tracking
- Statistics dashboard

### 6. Modern UI/UX
- Tesla-inspired neumorphic design
- Smooth animations and transitions
- 3D visual effects
- Glassmorphic elements
- Dark/light theme support
- Responsive design

## Backend Integration

The app integrates with a Flask backend deployed at `https://dyh6i3c0g3pl.manus.space` with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Recipes
- `GET /api/recipes` - Get recipes with filtering
- `GET /api/recipes/{id}` - Get specific recipe
- `GET /api/recipes/saved` - Get user's saved recipes
- `POST /api/recipes/saved` - Save a recipe
- `DELETE /api/recipes/saved/{id}` - Unsave a recipe

### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/user/progress` - Get user progress data

### Shopping List
- `GET /api/shopping` - Get shopping list
- `POST /api/shopping` - Add shopping item
- `PUT /api/shopping/{id}` - Update shopping item
- `DELETE /api/shopping/{id}` - Delete shopping item

### AI Chat
- `POST /api/ai/chat` - Send chat message to AI

## Building the App

### Android APK

1. **Setup Environment**
   ```bash
   # Ensure Flutter is in PATH
   export PATH="$PATH:/path/to/flutter/bin"
   
   # Accept Android licenses
   flutter doctor --android-licenses
   ```

2. **Install Dependencies**
   ```bash
   cd kitchen_spark_mobile
   flutter pub get
   ```

3. **Build Release APK**
   ```bash
   # Single APK for all architectures
   flutter build apk --release
   
   # Or split APKs by architecture (recommended for distribution)
   flutter build apk --split-per-abi --release
   ```

4. **Output Location**
   - Single APK: `build/app/outputs/flutter-apk/app-release.apk`
   - Split APKs: `build/app/outputs/flutter-apk/app-{arch}-release.apk`

### iOS App Bundle

1. **Setup iOS Environment**
   ```bash
   # Install iOS dependencies
   cd ios
   pod install
   cd ..
   ```

2. **Build iOS App**
   ```bash
   # For simulator
   flutter build ios --simulator
   
   # For device (requires Apple Developer account)
   flutter build ios --release
   ```

3. **Create IPA (requires Xcode)**
   - Open `ios/Runner.xcworkspace` in Xcode
   - Select "Any iOS Device" as target
   - Product → Archive
   - Distribute App → Ad Hoc or App Store

## Configuration

### API Endpoint
Update the base URL in `lib/services/api_service.dart`:
```dart
static const String baseUrl = 'https://your-backend-url.com';
```

### App Branding
Customize app name, icon, and splash screen:
- App name: `android/app/src/main/AndroidManifest.xml` and `ios/Runner/Info.plist`
- Icon: Use `flutter_launcher_icons` package
- Splash: Configure in `flutter_native_splash.yaml`

## Troubleshooting

### Common Build Issues

1. **Gradle Build Failures**
   - Increase heap size in `android/gradle.properties`
   - Clean build: `flutter clean && flutter pub get`
   - Update Android SDK and build tools

2. **Memory Issues**
   - Add to `android/gradle.properties`:
     ```
     org.gradle.jvmargs=-Xmx4G -XX:MaxMetaspaceSize=1G
     ```

3. **NDK Issues**
   - Ensure NDK is installed via Android Studio
   - Set NDK version in `android/app/build.gradle`

4. **iOS Build Issues**
   - Update CocoaPods: `pod repo update`
   - Clean iOS build: `cd ios && rm -rf Pods Podfile.lock && pod install`

### Performance Optimization

1. **Enable R8/ProGuard** (Android)
   ```gradle
   android {
       buildTypes {
           release {
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

2. **Optimize Images**
   - Use WebP format for better compression
   - Implement lazy loading for recipe images

3. **Code Splitting**
   - Use deferred imports for large features
   - Implement route-based code splitting

## Deployment

### Android
- Upload APK to Google Play Console
- Configure app signing and release management
- Set up staged rollout for testing

### iOS
- Submit to App Store Connect
- Configure TestFlight for beta testing
- Follow Apple's review guidelines

## Security Considerations

1. **API Security**
   - JWT tokens are stored securely using SharedPreferences
   - HTTPS-only communication with backend
   - Token refresh mechanism implemented

2. **Data Protection**
   - Sensitive data encrypted at rest
   - No hardcoded secrets in source code
   - Proper certificate pinning for production

## Support and Maintenance

- Regular dependency updates
- Monitor crash reports via Firebase Crashlytics
- Performance monitoring with Firebase Performance
- User feedback collection through in-app forms

## License

This project is proprietary software. All rights reserved.

