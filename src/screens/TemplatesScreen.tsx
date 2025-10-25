import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import {useTemplateStore} from '../stores/useTemplateStore';
import {useMapStore} from '../stores/useMapStore';
import {Card} from '../components/base/Card';
import {Template} from '../types';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {nanoid} from 'nanoid/non-secure';

export const TemplatesScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {templates} = useTemplateStore();
  const {createMap, addNode, addEdge, setCurrentMap} = useMapStore();

  const handleTemplatePress = useCallback(
    (template: Template) => {
      // Create new map from template
      const mapId = createMap(`${template.name} Map`);

      // Add nodes from template
      const nodeIdMap: Record<string, string> = {};
      template.structure.nodes.forEach(templateNode => {
        const nodeId = addNode(mapId, {
          text: templateNode.text,
          x: templateNode.x,
          y: templateNode.y,
          color: templateNode.color,
          fontSize: templateNode.fontSize,
          icon: templateNode.icon,
        });
        nodeIdMap[templateNode.id] = nodeId;
      });

      // Add edges from template
      template.structure.edges.forEach(templateEdge => {
        addEdge(mapId, {
          mapId,
          fromNodeId: nodeIdMap[templateEdge.fromNodeId],
          toNodeId: nodeIdMap[templateEdge.toNodeId],
          style: templateEdge.style,
          color: templateEdge.color,
          width: templateEdge.width,
        });
      });

      // Navigate to canvas
      setCurrentMap(mapId);
      navigation.navigate('Canvas');
    },
    [createMap, addNode, addEdge, setCurrentMap, navigation]
  );

  const renderItem = useCallback(
    ({item}: {item: Template}) => (
      <Card
        onPress={() => handleTemplatePress(item)}
        style={styles.templateCard}
      >
        <View style={styles.templateContent}>
          <View
            style={[
              styles.thumbnail,
              {backgroundColor: item.isPro ? '#FFD700' : '#E5E5EA'},
            ]}
          >
            {item.isPro && (
              <Text style={styles.proLabel}>PRO</Text>
            )}
          </View>

          <Text style={styles.templateName}>{item.name}</Text>
          <Text style={styles.templateDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </Card>
    ),
    [handleTemplatePress]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Templates</Text>
      </View>

      <FlatList
        data={templates}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
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
  row: {
    justifyContent: 'space-between',
  },
  templateCard: {
    flex: 1,
    margin: spacing.xs,
    maxWidth: '48%',
  },
  templateContent: {
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proLabel: {
    ...typography.caption1,
    fontWeight: '700',
    color: '#000000',
  },
  templateName: {
    ...typography.title3,
    color: '#000000',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  templateDescription: {
    ...typography.caption1,
    color: '#8E8E93',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  category: {
    ...typography.caption2,
    color: '#007AFF',
  },
});
