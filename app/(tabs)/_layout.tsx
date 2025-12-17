import { AccountProvider } from "@/contexts/AppContext";
import { Feather, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function _Layout() {
  return (
    <AccountProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#f43f5e",
          tabBarInactiveTintColor: "#71717a",
          tabBarStyle: {
            backgroundColor: "#18181b",
            borderColor: "#18181b",
          },
          tabBarLabelStyle: {
            fontFamily: "OutfitMedium",
          },
          headerTitleStyle: {
            fontFamily: "OutfitMedium",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Cards",
            tabBarIcon: ({ color }) => (
              <Feather name="credit-card" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="txs"
          options={{
            headerShown: false,
            title: "Transactions",
            tabBarIcon: ({ color }) => (
              <Octicons name="history" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            headerShown: false,
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Feather name="settings" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </AccountProvider>
  );
}
