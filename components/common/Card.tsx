import React from "react";
import { TouchableOpacity, View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

export function Card({ children, className = "", onPress }: CardProps) {
  const cls = `bg-white rounded-3xl p-4 shadow-sm ${className}`;
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} className={cls}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View className={cls}>{children}</View>;
}
