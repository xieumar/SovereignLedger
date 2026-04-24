import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LayoutDashboard, ArrowLeftRight, BarChart3, Target, Settings,
} from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants';

const TAB_ICONS: Record<string, any> = {
  index:          LayoutDashboard,
  analytics:      BarChart3,
  budgets:        Target,
  settings:       Settings,
};

const TAB_LABELS: Record<string, string> = {
  index:          'Overview',
  analytics:      'Insights',
  budgets:        'Budgets',
  settings:       'Settings',
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={({ route }) => {
        const Icon = TAB_ICONS[route.name] ?? LayoutDashboard;
        const label = TAB_LABELS[route.name] ?? route.name;
        return {
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              height: 60 + insets.bottom,
              paddingBottom: 8 + insets.bottom,
            }
          ],
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Icon size={20} color={color} />
            </View>
          ),
          tabBarLabel: label,
        };
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="add-transaction"
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as any)}
              style={styles.fabWrap}
              activeOpacity={0.85}
            >
              <View style={styles.fab}>
                <Text style={styles.fabPlus}>+</Text>
              </View>
            </TouchableOpacity>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="budgets" />
      <Tabs.Screen name="allocations" options={{ href: null }} />
      <Tabs.Screen name="monthly-burn" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bg1,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  tabItem:  { paddingTop: 4 },
  tabLabel: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  iconWrap: {
    width: 36, height: 28,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: RADIUS.sm,
  },
  iconWrapActive: { backgroundColor: COLORS.primary + '18' },
  fabWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    marginTop: -20,
  },
  fab: {
    width: 52, height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  fabPlus: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
});