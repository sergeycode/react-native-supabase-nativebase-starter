import { Center, Heading } from 'native-base';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  return (
    <Center px={4} flex={1}>
      <Heading>Welcome</Heading>
    </Center>
  );
}
