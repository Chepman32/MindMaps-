import React, {useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import {useMapStore} from '../stores/useMapStore';
import {OutlineItem} from '../types';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {Button} from '../components/base/Button';

export const OutlinerScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {getCurrentNodes, getCurrentMap} = useMapStore();
  const nodes = getCurrentNodes();
  const currentMap = getCurrentMap();

  // Convert flat nodes to hierarchical outline
  const outlineItems = useMemo((): OutlineItem[] => {
    const buildHierarchy = (parentId?: string, level = 0): OutlineItem[] => {
      return nodes
        .filter(node => node.parentId === parentId)
        .map(node => ({
          id: node.id,
          text: node.text,
          level,
          nodeId: node.id,
          collapsed: false,
          children: buildHierarchy(node.id, level + 1),
        }));
    };

    return buildHierarchy();
  }, [nodes]);

  const renderOutlineItem = (item: OutlineItem) => {
    const indentSize = item.level * 20;

    return (
      <View key={item.id}>
        <Pressable
          style={[styles.outlineItem, {paddingLeft: spacing.md + indentSize}]}
        >
          <View style={[styles.bullet, {backgroundColor: '#007AFF'}]} />
          <Text style={styles.outlineText}>{item.text}</Text>
        </Pressable>

        {item.children.map(child => renderOutlineItem(child))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          variant="ghost"
          size="small"
        />
        <Text style={styles.title}>{currentMap?.title || 'Outline'}</Text>
        <View style={{width: 60}} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {outlineItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in outline yet</Text>
          </View>
        ) : (
          outlineItems.map(item => renderOutlineItem(item))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    ...typography.title2,
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  outlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  outlineText: {
    ...typography.body,
    color: '#000000',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...typography.body,
    color: '#8E8E93',
  },
});
