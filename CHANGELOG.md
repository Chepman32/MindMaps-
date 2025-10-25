# Changelog

All notable changes to MindMaps+ will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-25

### Added

#### Core Features
- **Mind Mapping Canvas**: Gesture-first canvas with pan, pinch, zoom, and rotate
- **Node Management**: Create, edit, delete, and style nodes with rich customization
- **Edge Connections**: Multiple edge styles (solid, dashed, curved)
- **Outliner View**: Hierarchical outline view with collapsible sections
- **Template Library**: Pre-built templates for common use cases (Brainstorming, Project Planning, Study Guide)

#### Advanced Features
- **Undo/Redo System**: Complete history management with 50-action buffer
- **Search Functionality**: Full-text search across maps and nodes with relevance scoring
- **Auto-Layout Algorithms**:
  - Radial layout for circular organization
  - Tree layout for hierarchical structures
  - Force-directed layout with physics simulation
  - Grid layout for organized arrangement
- **Advanced Node Editor**: Rich text editing with color picker and font size selection
- **Keyboard Shortcuts**: Full keyboard navigation support (Cmd+N, Cmd+S, Cmd+Z, etc.)
- **Theme System**: 5 beautiful theme presets (Default, Ocean, Forest, Sunset, Monochrome)
- **Custom Themes**: Create and save custom color themes

#### Export & Sharing
- **OPML Export**: Industry-standard outline format
- **JSON Export**: Full backup with metadata
- **Text Export**: Plain text outlines
- **PNG Export**: High-quality image export
- **JPEG Export**: Compressed image export
- **PDF Export**: Document export (basic implementation)
- **Share Integration**: Native share sheet integration

#### Performance & Quality
- **Error Boundaries**: Graceful error handling with detailed dev logging
- **Performance Monitoring**: Built-in performance tracking and FPS monitoring
- **Memory Tracking**: Monitor JS heap usage
- **Crash Reporting**: Comprehensive error logging

#### Data & Persistence
- **AsyncStorage**: Fast local storage with automatic persistence
- **Auto-save**: Automatic saving every 30 seconds
- **Backup/Restore**: Full data export and import
- **Offline-First**: 100% offline functionality, no internet required

#### UX Enhancements
- **Splash Screen**: Animated Skia-powered splash with particle effects
- **Onboarding Flow**: Beautiful 4-step onboarding for new users
- **Haptic Feedback**: Contextual haptic feedback for all interactions
- **Search Bar**: Real-time search with highlighted results
- **Error Messages**: User-friendly error messages with recovery options

#### Accessibility
- **VoiceOver**: Full VoiceOver support
- **Dynamic Type**: Respects system font size preferences
- **High Contrast**: Theme support for better visibility
- **Large Hit Targets**: Minimum 44pt touch targets
- **Semantic Labels**: Descriptive accessibility labels

#### Animations
- **Reanimated 3**: 60fps animations using native driver
- **Spring Physics**: Natural spring-based transitions
- **Gesture Animations**: Smooth gesture-driven animations
- **Page Transitions**: Fluid screen transitions
- **Micro-interactions**: Delightful press, hover, and focus animations

#### IAP Monetization
- **Pro Subscription**: Monthly ($2.99) and Yearly ($29.99) options
- **Lifetime Purchase**: One-time $49.99 option
- **Free Features**: Core functionality available for free
- **Premium Features**: Unlimited maps, premium templates, advanced export

### Technical Details

#### Architecture
- **React Native 0.75+**: Latest React Native with New Architecture
- **TypeScript**: Full type safety
- **Zustand**: Lightweight state management with Immer
- **React Navigation**: Type-safe navigation
- **Skia**: GPU-accelerated custom rendering

#### Dependencies
- `@shopify/react-native-skia`: Custom rendering and animations
- `react-native-reanimated`: High-performance animations
- `react-native-gesture-handler`: Advanced gesture recognition
- `react-native-iap`: In-app purchase integration
- `@react-native-async-storage/async-storage`: Local storage
- `react-native-fs`: File system access
- `react-native-view-shot`: Screenshot/export functionality
- `react-native-share`: Native share integration
- `react-native-haptic-feedback`: Haptic feedback
- `date-fns`: Date formatting
- `nanoid`: Unique ID generation

#### Performance
- **60 FPS**: Smooth animations on all supported devices
- **< 100ms**: Interaction latency
- **< 500ms**: Screen transitions
- **100+ nodes**: Smooth canvas rendering

#### Testing
- Jest configuration
- React Native Testing Library setup
- Component unit tests
- Store unit tests

### Documentation
- Comprehensive README with setup instructions
- DEVELOPMENT.md with architecture and patterns
- Inline code documentation
- TypeScript type definitions

### Platform Support
- iOS 13.0+
- Android (prepared but not tested)
- iPad support

## [Unreleased]

### Planned Features
- **Collaboration**: Real-time collaboration (local network)
- **Cloud Sync**: Optional iCloud sync
- **AI Assistance**: AI-powered suggestions
- **Voice Input**: Voice-to-text node creation
- **Apple Pencil**: Drawing and handwriting support
- **Widgets**: Home screen widgets
- **Watch App**: Quick note capture on Apple Watch
- **Mac Catalyst**: Native Mac app

---

## Version Guidelines

- **Major** (1.0.0): Breaking changes, major features
- **Minor** (0.1.0): New features, non-breaking changes
- **Patch** (0.0.1): Bug fixes, minor improvements
