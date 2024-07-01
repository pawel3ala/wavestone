import { TextInput as ImportedTextInput } from "react-native-paper";
import { useController } from "react-hook-form";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

type TextInputProps = {
  name: string;
  control: any;
  rules?: any;
  label: string;
  isError: boolean;
} & React.ComponentProps<typeof ImportedTextInput>;

export default function TextInput(props: TextInputProps) {
  const { name, control, rules, isError, label } = props;
  const colorScheme = useColorScheme();
  const {
    field,
    fieldState: { isDirty },
  } = useController({
    name: name,
    control: control,
    rules: rules,
  });

  return (
    <ImportedTextInput
      {...props}
      error={isDirty && isError}
      ref={field.ref}
      underlineColor="transparent"
      underlineStyle={{ height: 0 }}
      value={field.value}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      theme={{
        colors: {
          surfaceVariant: Colors[colorScheme ?? "light"].grey,
        },
      }}
    />
  );
}
