import { useState, type ReactElement } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import {
  Input,
  Button,
  Header,
  AuthFooterLink,
  ScreenLayout,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import { useToast } from '../context/ToastContext';
import { useShakeAnimation } from '../hooks';
import { validateLoginForm, hasErrors } from '../utils';
import { sharedStyles } from '../styles';
import type { LoginScreenProps, FormErrors } from '../types';

export default function LoginScreen({
  navigation,
}: LoginScreenProps): ReactElement {
  const { login, isLoading } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { showToast } = useToast();
  const { shakeValue, shake } = useShakeAnimation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors = validateLoginForm(email, password);
    setErrors(newErrors);
    if (hasErrors(newErrors)) {
      shake();
      return false;
    }
    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validate()) return;

    const result = await login(email, password);

    if (!result.success && result.error) {
      showToast(result.error, 'error');
      shake();
    }
  };

  return (
    <ScreenLayout withKeyboard contentStyle={sharedStyles.scrollContentAuth}>
      <Header title="SIGN IN" logoVariant="square-first" />

      <Animated.View
        style={[sharedStyles.form, { transform: [{ translateX: shakeValue }] }]}
      >
        <Input
          label="EMAIL"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          isDark={isDark}
        />
        <Input
          label="PASSWORD"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          error={errors.password}
          isDark={isDark}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotButton}
        >
          <Text style={[styles.forgotText, { color: colors.textSecondary }]}>
            FORGOT PASSWORD?
          </Text>
        </TouchableOpacity>

        <View style={sharedStyles.buttonContainer}>
          <Button
            title="SIGN IN"
            onPress={handleLogin}
            loading={isLoading}
            isDark={isDark}
          />
        </View>
      </Animated.View>

      <AuthFooterLink
        prompt="NO ACCOUNT?"
        linkText="CREATE ONE"
        onPress={() => navigation.navigate('Signup')}
      />
    </ScreenLayout>
  );
}

interface Styles {
  forgotButton: ViewStyle;
  forgotText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
