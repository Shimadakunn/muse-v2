import { Text as RNText, TextProps } from 'react-native';

export const Text = ({ children, ...props }: TextProps) => {
  return (
    <RNText className="text-foreground" {...props}>
      {children}
    </RNText>
  );
};
