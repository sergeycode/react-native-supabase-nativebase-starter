import { Button, IButtonProps } from 'native-base';

type NodeHandle = number;
interface NativeSyntheticEvent<T>
  extends React.BaseSyntheticEvent<T, NodeHandle, NodeHandle> {}

interface TextInputSubmitEditingEventData {
  text: string;
}
interface ButtonProps extends IButtonProps {
  onSubmitEditing?:
    | ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)
    | undefined;
}

export const PrimaryButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      size="lg"
      w="full"
      borderRadius="15"
      _dark={{
        colorScheme: 'amber',
      }}
      _light={{ colorScheme: 'green' }}
      {...props}
    >
      {children}
    </Button>
  );
};

export const LinkButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      variant="link"
      _dark={{
        colorScheme: 'amber',
      }}
      _light={{ colorScheme: 'green' }}
      {...props}
    >
      {children}
    </Button>
  );
};
