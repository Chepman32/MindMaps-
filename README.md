# MindMaps+ — Offline Mind Mapping & Outliner

A production-ready, fully offline iOS-first mind mapping application built with React Native, featuring gesture-first navigation, rich animations, and local-only data storage.

## Features

- **Fully Offline**: All data stored locally using SQLite
- **Gesture-First UI**: Intuitive pan, pinch, zoom controls
- **Rich Animations**: Physics-based animations using Reanimated 3
- **Custom Rendering**: Beautiful visuals powered by React Native Skia
- **Mind Maps & Outlines**: Dual view modes for flexible organization
- **Templates**: Pre-built templates for common use cases
- **Export**: Share maps as OPML, JSON, or text files
- **IAP Support**: Pro features via in-app purchases
- **Accessibility**: Full VoiceOver and Dynamic Type support

## Tech Stack

- **React Native 0.75+** with New Architecture (Fabric/TurboModules)
- **TypeScript** for type safety
- **react-native-reanimated 3** for smooth animations
- **react-native-gesture-handler** for gesture control
- **@shopify/react-native-skia** for custom rendering
- **Zustand** for state management
- **WatermelonDB** for offline database
- **react-native-iap** for monetization

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── base/        # Base components (Button, Card, etc.)
│   ├── generated/   # Generated component library (100 components)
│   ├── MapCard.tsx
│   ├── NodeRenderer.tsx
│   └── SplashScreen.tsx
├── screens/         # Screen components
│   ├── MapsListScreen.tsx
│   ├── CanvasScreen.tsx
│   ├── OutlinerScreen.tsx
│   ├── TemplatesScreen.tsx
│   └── SettingsScreen.tsx
├── stores/          # Zustand state management
│   ├── useMapStore.ts
│   ├── useCanvasStore.ts
│   ├── useTemplateStore.ts
│   ├── useSettingsStore.ts
│   └── useIAPStore.ts
├── navigation/      # React Navigation setup
│   └── RootNavigator.tsx
├── theme/           # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
├── utils/           # Utilities
│   ├── animations.ts
│   ├── gestures.ts
│   └── export.ts
└── types/           # TypeScript types
    └── index.ts
```

## Installation

### Prerequisites

- Node.js >= 18
- Xcode >= 14 (for iOS)
- CocoaPods
- React Native CLI

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Install iOS dependencies:

```bash
cd ios && pod install && cd ..
```

4. Run the app:

```bash
# iOS
npm run ios

# Android (future support)
npm run android
```

## Component Library

The app includes 100 specialized UI components, each with:
- Custom gesture handlers (tap, pan, pinch, drag, etc.)
- Animation hooks (spring, timing, focus transitions)
- Skia rendering for performance
- Full accessibility support
- Offline-first behavior

Components are generated via the ComponentRegistry pattern for consistency and maintainability.

## State Management

### Stores

- **useMapStore**: Manages maps, nodes, and edges
- **useCanvasStore**: Canvas transform, selection state
- **useTemplateStore**: Template library
- **useSettingsStore**: App settings and preferences
- **useIAPStore**: In-app purchase state

All stores use Zustand with Immer for immutable updates.

## Animations

### Motion Specifications

The app includes 15+ predefined motion patterns:
- Press scale spring (stiffness: 240, damping: 18)
- Focus transitions (opacity + scale)
- Dismiss swipe animations
- Reveal fling effects
- Card morph animations

All animations use Reanimated 3 worklets for 60fps performance.

## Gestures

Supported gestures:
- **Tap**: Quick actions
- **Double Tap**: Zoom/expand
- **Long Press**: Context menus
- **Pan**: Move canvas/items
- **Pinch**: Zoom in/out
- **Edge Swipe**: Navigation
- **Drag**: Reposition nodes

## Export Formats

- **OPML**: Standard outline format
- **JSON**: Full backup with metadata
- **Text**: Simple text outline
- **PDF**: Visual snapshot (planned)
- **PNG**: Image export (planned)

## Offline Architecture

All data operations use local SQLite database:
- Deterministic behavior without network
- Instant saves and loads
- No external API dependencies
- Privacy-first: data never leaves device

## IAP Products

- **Pro Monthly**: $2.99/month
- **Pro Yearly**: $29.99/year (save 17%)
- **Pro Lifetime**: $49.99 one-time

Pro features:
- Unlimited maps
- Premium templates
- Advanced styling
- Priority support

## Accessibility

- VoiceOver support for all interactive elements
- Dynamic Type scaling
- High contrast mode
- Haptic feedback
- Large hit targets (44pt minimum)

## Performance Budgets

- 60fps animations on iPhone 12+
- < 100ms interaction latency
- < 500ms screen transitions
- Smooth canvas with 100+ nodes

## Testing

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Unit tests
npm test
```

## Building for Production

### iOS

1. Open `ios/MindMapsPlus.xcworkspace` in Xcode
2. Select your signing team
3. Archive the app
4. Submit to App Store

## License

© 2025 MindMaps+. All rights reserved.

## Support

For issues and feature requests, please open a GitHub issue.
