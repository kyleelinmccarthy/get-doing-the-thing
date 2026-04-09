import { type TextInputProps } from "react-native";
import { Input } from "./Input";

interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Textarea({ ...props }: TextareaProps) {
  return (
    <Input
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      style={{ minHeight: 100 }}
      {...props}
    />
  );
}
