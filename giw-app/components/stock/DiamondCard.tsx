import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Diamond {
  id: string | number;
  stockId?: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut?: string;
  price: number;
  status?: string;
  available?: boolean;
  certification?: string;
  fancyIntensity?: string;
  fancyOvertone?: string;
}

interface DiamondCardProps {
  diamond: Diamond;
  onPress: (id: string | number) => void;
  onMenuPress?: (id: string | number) => void;
}

export default function DiamondCard({
  diamond,
  onPress,
  onMenuPress,
}: DiamondCardProps) {
  return (
    <Pressable
      onPress={() => onPress(diamond.id)}
      className="bg-white mx-4 mb-3 p-4 rounded-2xl shadow-sm border border-slate-100 active:bg-slate-50"
    >
      {/* Top Row: Shape + Weight + Menu */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-slate-900 uppercase">
            {diamond.shape}
          </Text>
          <Text className="text-base text-slate-500">
            {diamond.carat} ct
          </Text>
        </View>
        <Pressable
          onPress={() => onMenuPress?.(diamond.id)}
          className="p-2 -mr-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="more-vert" size={20} color="#94A3B8" />
        </Pressable>
      </View>

      {/* Stock ID */}
      <View className="flex-row items-center gap-1.5 mb-3">
        <MaterialIcons name="inventory-2" size={14} color="#1E3A8A" />
        <Text className="text-sm font-semibold text-blue-900">
          {diamond.stockId || diamond.id}
        </Text>
        {diamond.certification && (
          <View className="flex-row items-center bg-blue-50 px-2 py-0.5 rounded ml-2">
            <MaterialIcons name="verified" size={12} color="#1E3A8A" />
            <Text className="text-xs font-medium text-blue-900 ml-1">
              {diamond.certification}
            </Text>
          </View>
        )}
      </View>

      {/* Badges Row */}
      <View className="flex-row gap-2 mb-3">
        {/* Color Badge */}
        <View className="bg-slate-100 px-3 py-1.5 rounded-lg">
          <Text className="text-xs text-slate-500 mb-0.5">Color</Text>
          <Text className="text-sm font-bold text-slate-900">
            {diamond.color}
          </Text>
        </View>

        {/* Clarity Badge */}
        <View className="bg-slate-100 px-3 py-1.5 rounded-lg">
          <Text className="text-xs text-slate-500 mb-0.5">Clarity</Text>
          <Text className="text-sm font-bold text-slate-900">
            {diamond.clarity}
          </Text>
        </View>

        {/* Cut Badge */}
        <View className="bg-slate-100 px-3 py-1.5 rounded-lg">
          <Text className="text-xs text-slate-500 mb-0.5">Cut</Text>
          <Text className="text-sm font-bold text-slate-900">
            {diamond.cut || "-"}
          </Text>
        </View>
      </View>

      {/* Fancy Color Row (if applicable) */}
      {diamond.fancyIntensity && (
        <View className="flex-row items-center gap-2 bg-pink-50 px-3 py-2 rounded-lg mb-3">
          <MaterialIcons name="auto-awesome" size={16} color="#BE185D" />
          <Text className="text-sm font-medium text-pink-700">
            {diamond.fancyIntensity}
            {diamond.fancyOvertone ? ` ${diamond.fancyOvertone}` : ""}
          </Text>
        </View>
      )}

      {/* Bottom Row: Price + Status */}
      <View className="flex-row items-center justify-between pt-2 border-t border-slate-100">
        <View>
          <Text className="text-xs text-slate-500 mb-0.5">Price</Text>
          <Text className="text-lg font-bold text-blue-900">
            ${diamond.price?.toLocaleString()}
          </Text>
        </View>

        {/* Status */}
        <View
          className={`px-3 py-1.5 rounded-full ${
            diamond.available || diamond.status === "AVAILABLE"
              ? "bg-emerald-100"
              : "bg-amber-100"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              diamond.available || diamond.status === "AVAILABLE"
                ? "text-emerald-700"
                : "text-amber-700"
            }`}
          >
            {diamond.status || "AVAILABLE"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
