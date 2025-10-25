import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Card} from './base/Card';
import {Map} from '../types';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {format} from 'date-fns';

export interface MapCardProps {
  map: Map;
  onPress: (map: Map) => void;
}

export const MapCard: React.FC<MapCardProps> = ({map, onPress}) => {
  return (
    <Card onPress={() => onPress(map)} variant="elevated">
      <View style={styles.container}>
        {map.thumbnail ? (
          <Image
            source={{uri: map.thumbnail}}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {map.title}
          </Text>

          <View style={styles.metadata}>
            <Text style={styles.nodeCount}>{map.nodeCount} nodes</Text>
            <Text style={styles.date}>
              {format(new Date(map.updatedAt), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.title3,
    color: '#000000',
    marginBottom: spacing.xs,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nodeCount: {
    ...typography.subheadline,
    color: '#8E8E93',
  },
  date: {
    ...typography.caption1,
    color: '#8E8E93',
  },
});
