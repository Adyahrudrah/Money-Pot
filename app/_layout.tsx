import {
  Outfit_400Regular,
  Outfit_500Medium,
  useFonts,
} from "@expo-google-fonts/outfit";
import { Stack } from "expo-router";
import * as SplashScreenLib from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native"; // <-- Import View

export default function RootLayout() {
  SplashScreenLib.preventAutoHideAsync();
  const [loaded, error] = useFonts({
    OutfitRegular: Outfit_400Regular, // 400
    OutfitMedium: Outfit_500Medium, // 500
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreenLib.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontFamily: "OutfitMedium",
          },
          headerBackTitleStyle: {
            fontFamily: "OutfitRegular",
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
