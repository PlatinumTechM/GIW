import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface QuickFilter {
  id: string;
  label: string;
  icon?: string;
}

interface QuickFiltersProps {
  filters: QuickFilter[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const DEFAULT_FILTERS: QuickFilter[] = [
  { id: "round", label: "Round", icon: "circle" },
  { id: "1-2ct", label: "1-2 ct", icon: "scale" },
  { id: "d-color", label: "D Color", icon: "palette" },
  { id: "if", label: "IF", icon: "diamond" },
  { id: "gia", label: "GIA", icon: "verified" },
  { id: "natural", label: "Natural", icon: "park" },
  { id: "available", label: "Available", icon: "check-circle" },
  { id: "fancy", label: "Fancy", icon: "auto-awesome" },
];

export default function QuickFilters({
  filters = DEFAULT_FILTERS,
  selectedIds,
  onToggle,
}: QuickFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4 pb-3"
      contentContainerStyle={{ gap: 8 }}
    >
      {filters.map((filter) => {
        const isSelected = selectedIds.includes(filter.id);
        return (
          <Pressable
            key={filter.id}
            onPress={() => onToggle(filter.id)}
            className={`flex-row items-center px-4 py-2.5 rounded-full border ${
              isSelected
                ? "bg-blue-900 border-blue-900"
                : "bg-white border-slate-200"
            }`}
          >
            {filter.icon && (
              <MaterialIcons
                name={filter.icon as any}
                size={16}
                color={isSelected ? "#fff" : "#64748B"}
                style={{ marginRight: 6 }}
              />
            )}
            <Text
              className={`text-sm font-medium ${
                isSelected ? "text-white" : "text-slate-600"
              }`}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
