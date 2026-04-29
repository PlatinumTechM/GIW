import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserManagementScreen from '../screens/UserManagementScreen';
import SubscriptionManagementScreen from '../screens/SubscriptionManagementScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Tab icon component using MaterialIcons
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const iconMap: Record<string, string> = {
    Users: 'people',
    Plans: 'card-membership',
    Profile: 'person',
  };
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <MaterialIcons
        name={iconMap[name] || 'help'}
        size={22}
        color={focused ? '#1D4ED8' : '#64748B'}
      />
    </View>
  );
};

const AdminTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen
        name="Users"
        component={UserManagementScreen}
        options={{ tabBarLabel: 'Users' }}
      />
      <Tab.Screen
        name="Plans"
        component={SubscriptionManagementScreen}
        options={{ tabBarLabel: 'Plans' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: 70,
    paddingBottom: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tabBarItem: {
    paddingVertical: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: '#DBEAFE',
  },
  iconText: {
    fontSize: 18,
  },
  iconTextActive: {
    fontSize: 18,
  },
});

export default AdminTabs;
