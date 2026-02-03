import { type ReactElement } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import { ToastContainer } from './src/components';
import RootNavigator from './src/navigation/RootNavigator';
import type { RootStackParamList } from './src/types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: Platform.OS === 'web' ? [window.location.origin] : [],
  config: {
    screens: {
      Login: '',
      Signup: 'signup',
      ForgotPassword: 'forgot-password',
      Home: 'home',
    },
  },
};

export default function App(): ReactElement {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <NavigationContainer linking={linking}>
              <RootNavigator />
            </NavigationContainer>
            <ToastContainer />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
