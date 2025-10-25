import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Circle: 'Circle',
  Group: 'Group',
  Path: 'Path',
  RoundedRect: 'RoundedRect',
  Text: 'Text',
  Shadow: 'Shadow',
  useFont: jest.fn(() => null),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
