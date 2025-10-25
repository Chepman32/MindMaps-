import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useMapStore} from '../stores/useMapStore';
import {MapCard} from '../components/MapCard';
import {Button} from '../components/base/Button';
import {Map} from '../types';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

export const MapsListScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {maps, createMap, setCurrentMap} = useMapStore();

  const handleCreateMap = useCallback(() => {
    const mapId = createMap('New Mind Map');
    setCurrentMap(mapId);
    navigation.navigate('Canvas');
  }, [createMap, setCurrentMap, navigation]);

  const handleMapPress = useCallback(
    (map: Map) => {
      setCurrentMap(map.id);
      navigation.navigate('Canvas');
    },
    [setCurrentMap, navigation]
  );

  const renderItem = useCallback(
    ({item}: {item: Map}) => (
      <View style={styles.cardContainer}>
        <MapCard map={item} onPress={handleMapPress} />
      </View>
    ),
    [handleMapPress]
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Maps Yet</Text>
      <Text style={styles.emptyText}>
        Create your first mind map to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>My Maps</Text>
        <Button
          title="New Map"
          onPress={handleCreateMap}
          size="medium"
          accessibilityLabel="Create new mind map"
        />
      </View>

      <FlatList
        data={maps}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  title: {
    ...typography.largeTitle,
    color: '#000000',
  },
  listContent: {
    padding: spacing.md,
  },
  cardContainer: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    ...typography.title1,
    color: '#000000',
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
