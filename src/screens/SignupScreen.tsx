import { useState, type ReactElement } from 'react';
import { View, Text, Animated } from 'react-native';
import {
  Input,
  Button,
  Header,
  PasswordStrengthIndicator,
  AuthFooterLink,
  ScreenLayout,
} from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { getColors } from '../constants/colors';
import { useShakeAnimation } from '../hooks';
import { validateSignupForm, hasErrors } from '../utils';
import { sharedStyles } from '../styles';
import type { SignupScreenProps, FormErrors } from '../types';

export default function SignupScreen({
  navigation,
}: SignupScreenProps): ReactElement {
  const { signup, isLoading } = useAuth();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const colors = getColors(isDark);
  const { shakeValue, shake } = useShakeAnimation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors = validateSignupForm(name, email, password);
    setErrors(newErrors);
    if (hasErrors(newErrors)) {
      shake();
      return false;
    }
    return true;
  };

  const handleSignup = async (): Promise<void> => {
    if (!validate()) return;

    const result = await signup(name, email, password);

    if (!result.success && result.error) {
      showToast(result.error, 'error');
      shake();
    }
  };

  const title = (
    <Text style={[sharedStyles.title, { color: colors.text }]}>
      CREATE{'\n'}ACCOUNT
    </Text>
  );

  return (
    <ScreenLayout withKeyboard contentStyle={sharedStyles.scrollContentAuth}>
      <Header title={title} logoVariant="square-first" />

      <Animated.View
        style={[sharedStyles.form, { transform: [{ translateX: shakeValue }] }]}
      >
        <Input
          label="FULL NAME"
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          autoCapitalize="words"
          error={errors.name}
          isDark={isDark}
        />
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
          placeholder="Min. 6 characters"
          secureTextEntry
          error={errors.password}
          isDark={isDark}
        />

        <PasswordStrengthIndicator password={password} />

        <View style={sharedStyles.buttonContainer}>
          <Button
            title="CREATE ACCOUNT"
            onPress={handleSignup}
            loading={isLoading}
            isDark={isDark}
          />
        </View>
      </Animated.View>

      <AuthFooterLink
        prompt="HAVE AN ACCOUNT?"
        linkText="SIGN IN"
        onPress={() => navigation.navigate('Login')}
      />
    </ScreenLayout>
  );
}
