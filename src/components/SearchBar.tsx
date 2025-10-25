import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  FlatList,
} from 'react-native';
import {useSearchStore, SearchResult} from '../stores/useSearchStore';
import {useMapStore} from '../stores/useMapStore';
import {Card} from './base/Card';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';

interface SearchBarProps {
  onResultPress?: (result: SearchResult) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({onResultPress}) => {
  const [isFocused, setIsFocused] = useState(false);
  const {query, results, setQuery, search, clearSearch} = useSearchStore();
  const {maps, nodes} = useMapStore();

  const handleSearch = (text: string) => {
    setQuery(text);

    if (text.trim()) {
      search(maps, nodes);
    } else {
      clearSearch();
    }
  };

  const handleResultPress = (result: SearchResult) => {
    onResultPress?.(result);
    setIsFocused(false);
  };

  const renderResult = ({item}: {item: SearchResult}) => (
    <Pressable
      style={styles.resultItem}
      onPress={() => handleResultPress(item)}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.resultPreview} numberOfLines={1}>
          {item.type === 'node' ? `in ${item.preview}` : item.preview}
        </Text>
      </View>
      <View
        style={[
          styles.resultBadge,
          {backgroundColor: item.type === 'map' ? '#007AFF' : '#34C759'},
        ]}
      >
        <Text style={styles.resultBadgeText}>
          {item.type === 'map' ? 'Map' : 'Node'}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.searchBox, isFocused && styles.searchBoxFocused]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search maps and nodes..."
          placeholderTextColor="#8E8E93"
        />
        {query.length > 0 && (
          <Pressable onPress={() => handleSearch('')}>
            <Text style={styles.clearButton}>✕</Text>
          </Pressable>
        )}
      </View>

      {isFocused && results.length > 0 && (
        <Card style={styles.results}>
          <FlatList
            data={results}
            renderItem={renderResult}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            style={styles.resultsList}
            maxHeight={300}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBoxFocused: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: '#000000',
  },
  clearButton: {
    ...typography.title3,
    color: '#8E8E93',
  },
  results: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    maxHeight: 300,
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    ...typography.body,
    fontWeight: '600',
    color: '#000000',
    marginBottom: spacing.xs,
  },
  resultPreview: {
    ...typography.caption1,
    color: '#8E8E93',
  },
  resultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xs,
  },
  resultBadgeText: {
    ...typography.caption2,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
