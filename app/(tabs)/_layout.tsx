import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nhập vào',
          tabBarIcon: ({}) => <FontAwesome5 name="pen" size={24} color={'rgb(0, 0, 0)'} />,
        }}
      />
      <Tabs.Screen
        name="gold"
        options={{
          title: 'Vàng',
          tabBarIcon: ({}) => <MaterialCommunityIcons name="gold" size={24} color={'rgb(0, 0, 0)'} />,
        }}
      />
      <Tabs.Screen
        name="historyTransaction"
        options={{
          title: 'Lịch',
          tabBarIcon: ({  }) => <Fontisto name="calendar" color="black" size={24} />,
        }}
        />
        <Tabs.Screen
        name="report"
        options={{
          title: 'Báo cáo',
          tabBarIcon: ({}) => <AntDesign name="barschart" size={24} color={'rgb(0, 0, 0)'} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Khác',
          tabBarIcon: ({}) => <AntDesign name="user" size={24} color={'rgb(0, 0, 0)'} />,
        }}
      />
      
    </Tabs>
  );
}
