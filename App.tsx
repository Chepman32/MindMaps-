import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootNavigator} from './src/navigation/RootNavigator';
import {ErrorBoundary} from './src/components/ErrorBoundary';
import {SplashScreen} from './src/components/SplashScreen';
import {OnboardingFlow} from './src/components/OnboardingFlow';
import {usePersistenceStore} from './src/stores/usePersistenceStore';
import {performanceMonitor} from './src/utils/performance';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const {initializeDatabase} = usePersistenceStore();

  useEffect(() => {
    const initialize = async () => {
      performanceMonitor.mark('app-init');

      try {
        // Initialize database
        await initializeDatabase();

        // Check if onboarding has been completed
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          'hasCompletedOnboarding'
        );

        if (!hasCompletedOnboarding) {
          setShowOnboarding(true);
        }

        performanceMonitor.measure('app-init');
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, [initializeDatabase]);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <RootNavigator />

        {showOnboarding && (
          <OnboardingFlow
            visible={showOnboarding}
            onComplete={handleOnboardingComplete}
          />
        )}
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
