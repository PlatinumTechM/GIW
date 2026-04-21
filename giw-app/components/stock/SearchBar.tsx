import React from "react";
import { View, TextInput, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = "Search stock, certificate...",
}: SearchBarProps) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      {/* Search Input */}
      <View className="flex-1 flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100">
        <MaterialIcons name="search" size={22} color="#64748B" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-3 text-slate-800 text-base"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText("")}>
            <MaterialIcons name="close" size={20} color="#94A3B8" />
          </Pressable>
        )}
      </View>

      {/* Filter Button */}
      <Pressable
        onPress={onFilterPress}
        className="bg-blue-900 w-12 h-12 rounded-2xl items-center justify-center shadow-sm"
      >
        <MaterialIcons name="tune" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}
