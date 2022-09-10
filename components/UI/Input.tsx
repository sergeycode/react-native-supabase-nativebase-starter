import { Input, IInputProps } from 'native-base';
interface InputProps extends IInputProps {
  error?: string | undefined;
  touched?: boolean | undefined;
}

export const PrimaryInput = ({ touched, error, ...props }: InputProps) => {
  return (
    <Input
      autoCapitalize={'none'}
      autoCorrect={false}
      borderRadius="15"
      _dark={{
        borderColor: !touched ? 'gray.500' : error ? 'rose.500' : 'gray.500',
        placeholderTextColor: 'gray.500',
      }}
      _light={{
        borderColor: !touched ? 'gray.900' : error ? 'rose.500' : 'gray.900',
        placeholderTextColor: 'gray.900',
      }}
      size="xl"
      w="100%"
      py="4"
      px="2"
      {...props}
    />
  );
};
