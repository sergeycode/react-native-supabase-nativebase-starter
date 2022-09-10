import { ScrollView, VStack, Text, Icon, useColorMode } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import { PrimaryButton } from '../components/UI/Button';
import { SignOut } from '../components/UserContext';
import { RootTabScreenProps } from '../types';

export default function SettingsScreen({
  navigation,
}: RootTabScreenProps<'Settings'>) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <ScrollView pt="10" px={4}>
      <VStack space={5} w="100%">
        <PrimaryButton
          w="150"
          onPress={toggleColorMode}
          rightIcon={
            <Icon
              as={<FontAwesome5 name={colorMode === 'dark' ? 'sun' : 'moon'} />}
              size={5}
            />
          }
        >
          <Text fontSize="md" color="white">
            {colorMode === 'dark' ? 'Light' : 'Dark'} mode
          </Text>
        </PrimaryButton>
        <PrimaryButton
          w="150"
          onPress={() => navigation.navigate('ModalEditProfile')}
          rightIcon={
            <Icon as={<FontAwesome5 name="user-edit" />} size={5} minW="7" />
          }
        >
          Edit Profile
        </PrimaryButton>
        <PrimaryButton onPress={() => SignOut()}>Sign Out</PrimaryButton>
      </VStack>
    </ScrollView>
  );
}
