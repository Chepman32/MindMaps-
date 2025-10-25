import React, {useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, StatusBar, Dimensions} from 'react-native';
import {GestureHandlerRootView, GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {useSharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {useMapStore} from '../stores/useMapStore';
import {useCanvasStore} from '../stores/useCanvasStore';
import {NodeRenderer} from '../components/NodeRenderer';
import {Button} from '../components/base/Button';
import {spacing} from '../theme/spacing';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const CanvasScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {getCurrentNodes, getCurrentEdges, addNode} = useMapStore();
  const {
    translateX: storeTranslateX,
    translateY: storeTranslateY,
    scale: storeScale,
    setTransform,
  } = useCanvasStore();

  const nodes = getCurrentNodes();
  const edges = getCurrentEdges();

  // Gesture values
  const translateX = useSharedValue(storeTranslateX);
  const translateY = useSharedValue(storeTranslateY);
  const scale = useSharedValue(storeScale);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  // Pan gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      setTransform(translateX.value, translateY.value, scale.value);
    });

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.max(0.5, Math.min(savedScale.value * event.scale, 3));
    })
    .onEnd(() => {
      setTransform(translateX.value, translateY.value, scale.value);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  const handleAddNode = useCallback(() => {
    const currentMapId = useMapStore.getState().currentMapId;
    if (currentMapId) {
      addNode(currentMapId, {
        text: 'New Node',
        x: 0,
        y: 0,
        color: '#007AFF',
        fontSize: 14,
        parentId: nodes[0]?.id,
      });
    }
  }, [addNode, nodes]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Canvas */}
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.canvas, animatedStyle]}>
            <NodeRenderer
              nodes={nodes}
              edges={edges}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              translateX={translateX.value}
              translateY={translateY.value}
              scale={scale.value}
            />
          </Animated.View>
        </GestureDetector>

        {/* Controls */}
        <View style={styles.controls}>
          <Button
            title="Back"
            onPress={handleBack}
            variant="ghost"
            size="small"
          />
          <Button
            title="Add Node"
            onPress={handleAddNode}
            size="medium"
          />
          <Button
            title="Outliner"
            onPress={() => navigation.navigate('Outliner')}
            variant="secondary"
            size="small"
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  canvas: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 60,
    right: spacing.md,
    gap: spacing.sm,
  },
});
