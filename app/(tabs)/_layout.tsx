import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useTheme } from '../contexts/themeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tint, // Dùng màu trong theme
        tabBarInactiveTintColor: theme.colors.tabBarIconInactive, // Dùng màu trong theme
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nhập vào',
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome5 name="pen" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gold"
        options={{
          title: 'Vàng',
          tabBarIcon: ({ color }: { color: string }) => <MaterialCommunityIcons name="gold" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="historyTransaction"
        options={{
          title: 'Lịch',
          tabBarIcon: ({ color }: { color: string }) => <Fontisto name="calendar" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Báo cáo',
          tabBarIcon: ({ color }: { color: string }) => <AntDesign name="barschart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Khác',
          tabBarIcon: ({ color }: { color: string }) => <AntDesign name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
