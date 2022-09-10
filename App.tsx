import {
  NativeBaseProvider,
  extendTheme,
  ColorMode,
  StorageManager,
  StatusBar,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

import { UserContextProvider, useUser } from './components/UserContext';
import Auth from './components/Auth';
import 'react-native-url-polyfill/auto';

// Define the config
const config = {
  useSystemColorMode: true,
  initialColorMode: 'light',
};

// extend the theme
export const theme = extendTheme({ config });

const colorModeManager: StorageManager = {
  get: async () => {
    try {
      let val = await AsyncStorage.getItem('@color-mode');
      return val === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  },
  set: async (value: ColorMode) => {
    try {
      await AsyncStorage.setItem('@color-mode', value as string);
    } catch (e) {
      console.log(e);
    }
  },
};

const Container = () => {
  const { user } = useUser();

  return user ? <Navigation /> : <Auth />;
};

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <UserContextProvider>
        <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
          <StatusBar />
          <Container />
        </NativeBaseProvider>
      </UserContextProvider>
    );
  }
}
