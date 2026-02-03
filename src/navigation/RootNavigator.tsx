import { type ReactElement } from 'react';
import { ActivityIndicator, View, StyleSheet, type ViewStyle } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): ReactElement {
  const { isAuthenticated, isInitializing } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  if (isInitializing) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  // Simple conditional rendering:
  // - Authenticated: only Home screen exists
  // - Not authenticated: only auth screens exist
  // If user tries to access a non-existent screen via URL,
  // React Navigation shows the first available screen
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

interface Styles {
  loading: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
