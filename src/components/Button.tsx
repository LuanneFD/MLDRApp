import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
    title: string;
    variant?: 'solid' | 'outline';
    size?: string;
}

export function Button({ title,variant = 'solid',size, ...rest }: Props) {
    return (
        <NativeBaseButton
            {...rest}
            width={size === null ? 'full' : size}
            height={14}
            background={variant === "outline" ?"transparent" : "green.700"}  
            borderWidth={variant === "outline" ? 1 : 0}
            borderColor="green.500"
            rounded="sm"
            _pressed={{ bg: variant === "outline" ? "gray.500" :"green.500" }}
        >
            <Text color={variant === "outline" ?"green.500" :"white"} fontFamily="heading" fontSize="sm">{title}</Text>
        </NativeBaseButton>
    );
}