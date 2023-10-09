import { Text, Pressable, IPressableProps } from "native-base";

type Props = IPressableProps & {
    name: string;
isActive: boolean;
}
export function Group({ name,isActive, ...rest }: Props) {
    return (
        <Pressable
            marginRight={3}
            width={24}
            height={10}
            background="gray.600"
            rounded="md"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
            isPressed={isActive}
            _pressed={{
                borderColor: "red.500",
                borderWidth: 1
            }}
            {...rest}
        >
            <Text color={isActive ? "red.500" : "gray.200"}
                textTransform="uppercase"
                fontSize="xs"
                fontWeight="bold"
            >
                {name}
            </Text>
        </Pressable>
    );
}