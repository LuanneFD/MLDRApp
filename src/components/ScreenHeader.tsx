import { Heading, Center } from 'native-base';

type Props = {
    title:string;
}

export function ScreenHeader({title}:Props) {
    return (
        <Center background="gray.600" paddingBottom={6} paddingTop={16} marginBottom={5}>
            <Heading color="gray.100" fontSize="xl">{title}</Heading>
        </Center>
    );
}