import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  documentDirectory,
  EncodingType,
  readAsStringAsync,
  writeAsStringAsync,
} from "expo-file-system/legacy";

const Settings = () => {
  // EXPORT LOGIC
  const exportData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);

      const dataObject = Object.fromEntries(result);
      const jsonString = JSON.stringify(dataObject, null, 2);

      // documentDirectory will now be correctly typed and found
      if (!documentDirectory) {
        Alert.alert("Error", "Storage directory not accessible");
        return;
      }

      const fileUri = documentDirectory + "money_pot_backup.json";

      // Fixed: Using legacy import removes the deprecation warning
      await writeAsStringAsync(fileUri, jsonString, {
        encoding: EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Export Failed", "Could not create backup.");
    }
  };

  // IMPORT LOGIC
  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;

      // Fixed: Options object prevents runtime error
      const content = await readAsStringAsync(fileUri, {
        encoding: EncodingType.UTF8,
      });

      const data = JSON.parse(content);

      Alert.alert(
        "Confirm Import",
        "This will overwrite all current app data. Are you sure?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Import",
            style: "destructive",
            onPress: async () => {
              const pairs = Object.entries(data).map(
                ([k, v]) => [k, String(v)] as [string, string]
              );
              await AsyncStorage.clear();
              await AsyncStorage.multiSet(pairs);
              Alert.alert("Success", "Data restored. Please restart the app.");
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Import Error", "Invalid backup file selected.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bgc_1">
      <ScrollView className="px-6 pt-8">
        <Text className="text-3xl font-bold text-tc_1 mb-8">Settings</Text>

        <View className="bg-bgc_2 border border-bc_1 rounded-3xl p-6 mb-6">
          <Text className="text-tc_1/60 font-bold text-xs uppercase tracking-widest mb-4">
            Data Management
          </Text>

          <TouchableOpacity
            onPress={exportData}
            className="flex-row items-center bg-bgc_1 p-4 rounded-2xl mb-4"
          >
            <View className="w-10 h-10 rounded-full bg-bgc_2 items-center justify-center">
              <Feather name="download" size={20} color="#f43f5e" />
            </View>
            <View className="ml-4">
              <Text className="text-tc_1 font-semibold">Backup to JSON</Text>
              <Text className="text-tc_1/40 text-[10px]">
                Export everything to a file
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={importData}
            className="flex-row items-center bg-bgc_1 p-4 rounded-2xl"
          >
            <View className="w-10 h-10 rounded-full bg-bgc_2 items-center justify-center">
              <Feather name="upload" size={20} color="#10b981" />
            </View>
            <View className="ml-4">
              <Text className="text-tc_1 font-semibold">Restore Data</Text>
              <Text className="text-tc_1/40 text-[10px]">
                Import from a JSON file
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
