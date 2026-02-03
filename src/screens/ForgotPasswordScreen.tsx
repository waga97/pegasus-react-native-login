import { useState, type ReactElement } from 'react';
import { View, Animated } from 'react-native';
import {
  Input,
  Button,
  Header,
  AuthFooterLink,
  ScreenLayout,
} from '../components';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useShakeAnimation } from '../hooks';
import { validateEmail } from '../utils';
import { sharedStyles } from '../styles';
import type { ForgotPasswordScreenProps } from '../types';

export default function ForgotPasswordScreen({
  navigation,
}: ForgotPasswordScreenProps): ReactElement {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const { shakeValue, shake } = useShakeAnimation();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const error = validateEmail(email);
    setEmailError(error);
    if (error) {
      shake();
      return false;
    }
    return true;
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!validate()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    showToast(`Reset link sent to ${email}`, 'success');
    setEmail('');
    navigation.goBack();
  };

  return (
    <ScreenLayout withKeyboard contentStyle={sharedStyles.scrollContentAuth}>
      <Header title="RESET PASSWORD" logoVariant="square-first" />

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
          error={emailError}
          isDark={isDark}
        />

        <View style={sharedStyles.buttonContainer}>
          <Button
            title="SEND RESET LINK"
            onPress={handleResetPassword}
            loading={isLoading}
            isDark={isDark}
          />
        </View>
      </Animated.View>

      <AuthFooterLink
        prompt="REMEMBER PASSWORD?"
        linkText="SIGN IN"
        onPress={() => navigation.goBack()}
      />
    </ScreenLayout>
  );
}
