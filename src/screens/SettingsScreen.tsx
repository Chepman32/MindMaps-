import React, {useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Pressable,
} from 'react-native';
import {useSettingsStore} from '../stores/useSettingsStore';
import {useIAPStore} from '../stores/useIAPStore';
import {Button} from '../components/base/Button';
import {Card} from '../components/base/Card';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

export const SettingsScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const settings = useSettingsStore();
  const {isPro, products, loadProducts, purchaseProduct} = useIAPStore();

  const handlePurchase = useCallback(
    async (productId: string) => {
      const success = await purchaseProduct(productId);
      if (success) {
        settings.updateSettings({isPro: true});
      }
    },
    [purchaseProduct, settings]
  );

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Pro Status */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          {isPro ? (
            <Text style={styles.proStatus}>MindMaps+ Pro Active</Text>
          ) : (
            <>
              <Text style={styles.description}>
                Upgrade to Pro for unlimited maps, premium templates, and more
              </Text>
              {products.map(product => (
                <View key={product.productId} style={styles.productCard}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    <Text style={styles.productDescription}>
                      {product.description}
                    </Text>
                  </View>
                  <Button
                    title={product.price}
                    onPress={() => handlePurchase(product.productId)}
                    size="small"
                  />
                </View>
              ))}
            </>
          )}
        </Card>

        {/* Appearance */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Theme</Text>
            <View style={styles.themeButtons}>
              {(['light', 'dark', 'system'] as const).map(theme => (
                <Pressable
                  key={theme}
                  onPress={() => settings.updateSettings({theme})}
                  style={[
                    styles.themeButton,
                    settings.theme === theme && styles.themeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      settings.theme === theme && styles.themeButtonTextActive,
                    ]}
                  >
                    {theme}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dynamic Type</Text>
            <Switch
              value={settings.dynamicType}
              onValueChange={value =>
                settings.updateSettings({dynamicType: value})
              }
            />
          </View>
        </Card>

        {/* Experience */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Haptics</Text>
            <Switch
              value={settings.haptics}
              onValueChange={value => settings.updateSettings({haptics: value})}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Animations</Text>
            <Switch
              value={settings.animations}
              onValueChange={value =>
                settings.updateSettings({animations: value})
              }
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto-save</Text>
            <Switch
              value={settings.autoSave}
              onValueChange={value =>
                settings.updateSettings({autoSave: value})
              }
            />
          </View>
        </Card>

        {/* About */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>MindMaps+ v1.0.0</Text>
          <Text style={styles.aboutText}>
            © 2025 MindMaps+. All rights reserved.
          </Text>
        </Card>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.title3,
    color: '#000000',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: '#8E8E93',
    marginBottom: spacing.md,
  },
  proStatus: {
    ...typography.title3,
    color: '#34C759',
  },
  productCard: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  productInfo: {
    marginBottom: spacing.sm,
  },
  productTitle: {
    ...typography.callout,
    fontWeight: '600',
    color: '#000000',
    marginBottom: spacing.xs,
  },
  productDescription: {
    ...typography.caption1,
    color: '#8E8E93',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingLabel: {
    ...typography.body,
    color: '#000000',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  themeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  themeButtonText: {
    ...typography.subheadline,
    color: '#000000',
    textTransform: 'capitalize',
  },
  themeButtonTextActive: {
    color: '#FFFFFF',
  },
  aboutText: {
    ...typography.footnote,
    color: '#8E8E93',
    marginBottom: spacing.xs,
  },
});
