# Development Guide

## Architecture Overview

MindMaps+ follows a modular architecture with clear separation of concerns:

### Layer Structure

1. **Presentation Layer** (`src/screens/`, `src/components/`)
   - Screen components handle navigation and layout
   - UI components are reusable and composable
   - All components follow accessibility guidelines

2. **State Layer** (`src/stores/`)
   - Zustand stores manage application state
   - Stores use Immer for immutable updates
   - Each domain has its own store

3. **Domain Layer** (`src/types/`, `src/models/`)
   - TypeScript interfaces define data models
   - Business logic lives in store actions
   - Pure functions for calculations

4. **Utilities** (`src/utils/`)
   - Animation helpers
   - Gesture utilities
   - Export functions
   - Shared utilities

## Key Patterns

### Component Pattern

All UI components follow this structure:

```tsx
// 1. Imports
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// 2. Props interface
export interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

// 3. Component
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => {
  // Hooks
  const [state, setState] = React.useState();

  // Handlers
  const handlePress = () => {
    onPress?.();
  };

  // Render
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### Store Pattern

Zustand stores follow this structure:

```tsx
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

interface MyStore {
  // State
  data: string[];
  isLoading: boolean;

  // Actions
  loadData: () => Promise<void>;
  addItem: (item: string) => void;
}

export const useMyStore = create<MyStore>()(
  immer((set, get) => ({
    data: [],
    isLoading: false,

    loadData: async () => {
      set(state => {
        state.isLoading = true;
      });

      // Async operation
      const result = await fetchData();

      set(state => {
        state.data = result;
        state.isLoading = false;
      });
    },

    addItem: (item) => {
      set(state => {
        state.data.push(item);
      });
    },
  }))
);
```

### Animation Pattern

Reanimated 3 animations:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export const AnimatedComponent = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      {/* Content */}
    </Animated.View>
  );
};
```

### Gesture Pattern

Gesture Handler with Reanimated:

```tsx
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {useSharedValue} from 'react-native-reanimated';

export const DraggableComponent = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      // Snap back or commit
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        {/* Content */}
      </Animated.View>
    </GestureDetector>
  );
};
```

## Adding New Features

### 1. Add New Screen

```bash
# Create screen file
touch src/screens/NewScreen.tsx

# Add to navigation
# Edit src/navigation/RootNavigator.tsx
```

### 2. Add New Store

```bash
# Create store file
touch src/stores/useNewStore.ts

# Follow store pattern
# Export from index if needed
```

### 3. Add New Component

```bash
# Create component file
touch src/components/NewComponent.tsx

# Follow component pattern
# Add to component index
```

## Testing

### Unit Tests

```tsx
// Component.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {MyComponent} from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const {getByText} = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles press', () => {
    const onPress = jest.fn();
    const {getByRole} = render(
      <MyComponent title="Test" onPress={onPress} />
    );

    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Store Tests

```tsx
// useMyStore.test.ts
import {renderHook, act} from '@testing-library/react-hooks';
import {useMyStore} from './useMyStore';

describe('useMyStore', () => {
  it('adds item', () => {
    const {result} = renderHook(() => useMyStore());

    act(() => {
      result.current.addItem('test');
    });

    expect(result.current.data).toContain('test');
  });
});
```

## Performance Optimization

### 1. Memoization

```tsx
// Use React.memo for components
export const MyComponent = React.memo(({data}) => {
  return <View>{/* ... */}</View>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for handlers
const handlePress = useCallback(() => {
  doSomething(value);
}, [value]);
```

### 2. List Optimization

```tsx
// Use FlatList with proper optimization
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews
/>
```

### 3. Skia Performance

```tsx
// Use worklets for Skia computations
const drawNode = useCallback(() => {
  'worklet';
  // All Skia drawing code
}, [dependencies]);
```

## Debugging

### React Native Debugger

1. Install: `brew install react-native-debugger`
2. Open debugger: `open "rndebugger://set-debugger-loc?host=localhost&port=8081"`
3. Enable in app: Cmd+D → Debug

### Flipper

1. Install Flipper desktop app
2. Launch app in debug mode
3. Flipper auto-connects

### Logging

```tsx
// Use __DEV__ for development-only logs
if (__DEV__) {
  console.log('Debug info:', data);
}

// Use console.warn for warnings
console.warn('Deprecated API used');

// Use console.error for errors
console.error('Operation failed:', error);
```

## Code Style

### TypeScript

- Use strict mode
- Define interfaces for all props
- Avoid `any` type
- Use type inference when possible

### React

- Functional components only
- Use hooks (no class components)
- Keep components small and focused
- Extract complex logic to custom hooks

### Naming

- Components: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase with 'use' prefix (`useMyHook.ts`)
- Utils: camelCase (`myUtil.ts`)
- Types: PascalCase (`MyType`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_ITEMS`)

## Git Workflow

### Branches

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `refactor/*`: Code refactoring

### Commits

Follow conventional commits:

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run tests: `npm test`
4. Build iOS: Xcode → Archive
5. Submit to App Store Connect
6. Tag release: `git tag v1.0.0`
7. Push: `git push --tags`
