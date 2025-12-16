import { Alert, PermissionsAndroid, Platform } from "react-native";

const requestSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS !== "android") return false;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    ]);

    const readGranted =
      granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
      PermissionsAndroid.RESULTS.GRANTED;

    if (!readGranted) {
      Alert.alert(
        "Permission Denied",
        "READ_SMS permission is required to read messages."
      );
    }

    return readGranted;
  } catch (err) {
    console.warn("Permission error:", err);
    return false;
  }
};

export default requestSmsPermission;
