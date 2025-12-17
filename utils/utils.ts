import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToAsyncStorage = async (key: string, data: string) => {
  try {
    await AsyncStorage.setItem(key, data);
  } catch (e) {
    console.error(`Failed to save ${key}`, e);
  }
};

export const removeFromAsyncStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to remove ${key}`, e);
  }
};

export const getFromAsyncStorage = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data;
  } catch (e) {
    console.error(`Failed to get ${key}`, e);
  }
};
