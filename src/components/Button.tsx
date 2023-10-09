import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
    title: string;
    variant?: 'solid' | 'outline';
    size? : number | null;
}

export function Button({ title,variant = 'solid',size, ...rest }: Props) {
    return (
        <NativeBaseButton
            {...rest}
            width={!!size ? size : 'full' }
            height={14}
            background={variant === "outline" ?"transparent" : "red.700"}  
            borderWidth={variant === "outline" ? 1 : 0}
            borderColor="red.500"
            rounded="sm"
            _pressed={{ bg: variant === "outline" ? "gray.500" :"red.500" }}
        >
            <Text color={variant === "outline" ?"red.500" :"white"} fontFamily="heading" fontSize="sm">{title}</Text>
        </NativeBaseButton>
    );
}