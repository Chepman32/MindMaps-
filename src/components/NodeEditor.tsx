import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {Node} from '../types';
import {Button} from './base/Button';
import {Card} from './base/Card';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import {colors} from '../theme/colors';

interface NodeEditorProps {
  node: Node | null;
  visible: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Node>) => void;
  onDelete?: () => void;
}

const NODE_COLORS = [
  '#FF6B6B',
  '#FFA06B',
  '#FFD93D',
  '#6BCF7F',
  '#6BA3FF',
  '#9B6BFF',
  '#FF6BB5',
  '#A0A0A0',
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

export const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  visible,
  onClose,
  onSave,
  onDelete,
}) => {
  const [text, setText] = useState(node?.text || '');
  const [color, setColor] = useState(node?.color || NODE_COLORS[0]);
  const [fontSize, setFontSize] = useState(node?.fontSize || 14);

  React.useEffect(() => {
    if (node) {
      setText(node.text);
      setColor(node.color);
      setFontSize(node.fontSize);
    }
  }, [node]);

  const handleSave = useCallback(() => {
    onSave({text, color, fontSize});
    onClose();
  }, [text, color, fontSize, onSave, onClose]);

  if (!node) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <Card style={styles.card}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Edit Node</Text>
                <Pressable onPress={onClose}>
                  <Text style={styles.closeButton}>✕</Text>
                </Pressable>
              </View>

              {/* Text Input */}
              <View style={styles.section}>
                <Text style={styles.label}>Text</Text>
                <TextInput
                  style={styles.input}
                  value={text}
                  onChangeText={setText}
                  placeholder="Enter node text"
                  multiline
                  numberOfLines={3}
                  autoFocus
                />
              </View>

              {/* Color Picker */}
              <View style={styles.section}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.colorGrid}>
                  {NODE_COLORS.map((c) => (
                    <Pressable
                      key={c}
                      style={[
                        styles.colorSwatch,
                        {backgroundColor: c},
                        color === c && styles.colorSwatchSelected,
                      ]}
                      onPress={() => setColor(c)}
                    >
                      {color === c && <Text style={styles.checkmark}>✓</Text>}
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Font Size */}
              <View style={styles.section}>
                <Text style={styles.label}>Font Size</Text>
                <View style={styles.fontSizeGrid}>
                  {FONT_SIZES.map((size) => (
                    <Pressable
                      key={size}
                      style={[
                        styles.fontSizeButton,
                        fontSize === size && styles.fontSizeButtonSelected,
                      ]}
                      onPress={() => setFontSize(size)}
                    >
                      <Text
                        style={[
                          styles.fontSizeText,
                          fontSize === size && styles.fontSizeTextSelected,
                        ]}
                      >
                        {size}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Button
                  title="Save"
                  onPress={handleSave}
                  variant="primary"
                  size="large"
                  style={styles.saveButton}
                />

                {onDelete && (
                  <Button
                    title="Delete"
                    onPress={() => {
                      onDelete();
                      onClose();
                    }}
                    variant="outline"
                    size="large"
                    style={styles.deleteButton}
                  />
                )}
              </View>
            </ScrollView>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '80%',
  },
  card: {
    margin: 0,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title2,
    color: '#000000',
  },
  closeButton: {
    ...typography.title2,
    color: '#8E8E93',
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.callout,
    fontWeight: '600',
    color: '#000000',
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    backgroundColor: '#F2F2F7',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  fontSizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  fontSizeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  fontSizeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  fontSizeText: {
    ...typography.body,
    color: '#000000',
  },
  fontSizeTextSelected: {
    color: '#FFFFFF',
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  saveButton: {
    width: '100%',
  },
  deleteButton: {
    width: '100%',
    borderColor: '#FF3B30',
  },
});
