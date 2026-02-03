import { useState, type ReactElement } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../constants/colors';
import { spacing, inputHeight } from '../constants/spacing';
import type { InputProps } from '../types';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  isDark = false,
}: InputProps): ReactElement {
  const colors = getColors(isDark);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showPassword = secureTextEntry && !isPasswordVisible;

  const containerStyle: ViewStyle = {
    borderBottomColor: error ? colors.red : isFocused ? colors.text : colors.border,
    backgroundColor: colors.inputBg,
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <View style={[styles.container, containerStyle]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>
      )}
    </View>
  );
}

interface Styles {
  wrapper: ViewStyle;
  label: TextStyle;
  container: ViewStyle;
  input: TextStyle;
  eyeButton: ViewStyle;
  errorText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  wrapper: {
    marginBottom: 28,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: inputHeight,
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  eyeButton: {
    padding: spacing.xs,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
});
