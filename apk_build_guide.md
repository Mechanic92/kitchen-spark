# Kitchen Spark Mobile - APK Build Guide

## Overview
This guide provides comprehensive instructions for building the Kitchen Spark mobile application APK from the Flutter source code.

## Prerequisites

### System Requirements
- **Operating System**: Ubuntu 22.04+ or similar Linux distribution
- **Memory**: Minimum 8GB RAM (16GB recommended for release builds)
- **Storage**: At least 10GB free space
- **Java**: OpenJDK 17 (required for latest Android SDK tools)

### Required Software
1. **Flutter SDK 3.24.5+**
2. **Android SDK with API Level 33**
3. **Java Development Kit 17**
4. **Git** (for version control)

## Installation Steps

### 1. Install Java 17
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### 2. Install Flutter
```bash
# Download Flutter
cd /opt
sudo git clone https://github.com/flutter/flutter.git -b stable
sudo chown -R $USER:$USER /opt/flutter
export PATH="$PATH:/opt/flutter/bin"

# Verify installation
flutter --version
```

### 3. Install Android SDK
```bash
# Create Android SDK directory
mkdir -p ~/android-sdk

# Download Android command line tools
cd ~
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mkdir -p android-sdk/cmdline-tools
mv cmdline-tools android-sdk/cmdline-tools/latest

# Set environment variables
export ANDROID_HOME=~/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Accept licenses and install SDK components
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Configure Flutter
flutter config --android-sdk $ANDROID_HOME
```

### 4. Verify Setup
```bash
flutter doctor
```
Ensure Android toolchain shows as available.

## Building the APK

### 1. Extract Project Files
```bash
# Extract the project archive
tar -xzf kitchen_spark_mobile_complete_v2.tar.gz
cd kitchen_spark_mobile
```

### 2. Install Dependencies
```bash
flutter pub get
```

### 3. Configure Build Settings
Create or update `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=1g -XX:+HeapDumpOnOutOfMemoryError
org.gradle.parallel=true
org.gradle.caching=true
android.useAndroidX=true
android.enableJetifier=true
```

### 4. Build APK

#### Debug Build (Faster, for testing)
```bash
flutter build apk --debug
```

#### Release Build (Optimized, for distribution)
```bash
flutter build apk --release
```

### 5. Locate Built APK
The APK will be located at:
- **Debug**: `build/app/outputs/flutter-apk/app-debug.apk`
- **Release**: `build/app/outputs/flutter-apk/app-release.apk`

## Troubleshooting

### Common Issues

#### 1. Gradle Daemon Crashes
**Symptoms**: Build fails with "Gradle build daemon disappeared unexpectedly"
**Solution**: 
- Reduce memory allocation in `gradle.properties`
- Kill existing Gradle processes: `pkill -f gradle`
- Clean project: `flutter clean && flutter pub get`

#### 2. Out of Memory Errors
**Symptoms**: Build fails with OutOfMemoryError
**Solution**:
- Increase system swap space
- Close other applications
- Use debug build instead of release build
- Build on a machine with more RAM

#### 3. SDK License Issues
**Symptoms**: "Failed to install the following Android SDK packages"
**Solution**:
```bash
yes | sdkmanager --licenses
```

#### 4. Missing Dependencies
**Symptoms**: Various compilation errors
**Solution**:
```bash
flutter clean
flutter pub get
flutter pub deps
```

### Alternative Build Methods

#### Using Android Studio
1. Open the `android` folder in Android Studio
2. Let Gradle sync complete
3. Build → Generate Signed Bundle/APK
4. Choose APK and follow the wizard

#### Using Gradle Directly
```bash
cd android
./gradlew assembleRelease
```

## Environment Variables
Add these to your `~/.bashrc` or `~/.profile`:
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=~/android-sdk
export PATH=$PATH:/opt/flutter/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

## Performance Optimization

### For Faster Builds
1. Enable Gradle daemon: Add `org.gradle.daemon=true` to `gradle.properties`
2. Use parallel builds: Add `org.gradle.parallel=true`
3. Enable build cache: Add `org.gradle.caching=true`
4. Increase JVM heap size appropriately for your system

### For Smaller APK Size
1. Enable ProGuard/R8 (already configured in release builds)
2. Use `--split-per-abi` flag to create separate APKs for different architectures
3. Remove unused resources with `--shrink` flag

## Next Steps
Once the APK is built successfully:
1. Test on physical Android device or emulator
2. Sign the APK for distribution (if not already signed)
3. Upload to Google Play Store or distribute directly

## Support
For build issues specific to this project, refer to:
- Flutter documentation: https://flutter.dev/docs
- Android developer documentation: https://developer.android.com
- Project README.md for application-specific information
