import { StatusBar, Center, Heading } from 'native-base';
import { Platform } from 'react-native';

export default function ModalScreen() {
  return (
    <Center px={4} flex={1}>
      <Heading>Modal</Heading>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'}
      />
    </Center>
  );
}
