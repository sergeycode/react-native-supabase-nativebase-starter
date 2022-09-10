import { Center, Heading } from 'native-base';
import { PrimaryButton } from '../components/UI/Button';
import { RootStackScreenProps } from '../types';

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<'NotFound'>) {
  return (
    <Center px={4} flex={1}>
      <Heading mb="6">This screen doesn't exist.</Heading>
      <PrimaryButton onPress={() => navigation.replace('Root')}>
        Go to Home Screen
      </PrimaryButton>
    </Center>
  );
}
