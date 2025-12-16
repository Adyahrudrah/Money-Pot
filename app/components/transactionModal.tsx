import { Transaction } from "@/types/type";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface TransactionModalProps {
  handleTxsMoal: () => void;
  selectedTransaction: Transaction;
}
const TransactionModal = ({
  handleTxsMoal,
  selectedTransaction,
}: TransactionModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!selectedTransaction}
      onRequestClose={handleTxsMoal}
    >
      <View className="flex-1 justify-end bg-bg_primary/50">
        <View className="bg-bg_secondary p-6 rounded-t-3xl">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-bg_primary text-lg font-bold">
              SMS Message Body
            </Text>
            <Pressable onPress={handleTxsMoal}>
              <Feather name="x" size={24} color="#9ca3af" />
            </Pressable>
          </View>

          <View className="bg-bg_tertiary p-4 rounded-xl">
            <ScrollView className="max-h-60">
              <Text className="text-bg_primary leading-6">
                {selectedTransaction?.message_body}
              </Text>
            </ScrollView>
          </View>

          <Pressable
            onPress={handleTxsMoal}
            className="mt-6 bg-bg_tertiary p-4 rounded-xl items-center"
          >
            <Text className="text-bg_primary font-bold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionModal;
