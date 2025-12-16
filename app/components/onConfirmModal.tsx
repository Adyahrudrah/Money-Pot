// ConfirmRemoveModal.tsx
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ConfirmRemoveModalProps {
  isVisible: boolean;
  accountName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmRemoveModal: React.FC<ConfirmRemoveModalProps> = ({
  isVisible,
  accountName,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-bg_primary/70">
        <View className="w-4/5 p-6 bg-bg_secondary  rounded-xl shadow-xl">
          <Text className=" text-xl font-bold mb-4">Confirm Deletion</Text>
          <Text className=" text-base mb-6">
            Are you sure you want to remove the account{" "}
            <Text className="text-xl text-text_primary font-bold">
              {accountName}
            </Text>
            ? This action cannot be undone.
          </Text>

          <View className="flex-row justify-end gap-4">
            <TouchableOpacity
              onPress={onCancel}
              className="py-3 px-4 rounded-lg"
            >
              <Text className="text-white font-medium">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="py-3 px-4 rounded-lg bg-error"
            >
              <Text className="text-white font-bold">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmRemoveModal;
