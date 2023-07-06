import { HStack, Heading, Image, Text, VStack,Icon } from 'native-base';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import {Entypo} from '@expo/vector-icons';

type Props = TouchableOpacityProps & {};

export function RecipeCard({ ...rest }: Props) {
    return (
        <TouchableOpacity {...rest}>
            <HStack background="gray.500" alignItems="center" padding={2} paddingRight={4} rounded="md" marginBottom={3}>
                <Image
                    width={20}
                    height={20}
                    rounded="md"
                    marginRight={4}
                    alt="Imagem da receita"
                    resizeMode='cover'
                    source={{ uri: 'https://static.itdg.com.br/images/1200-675/00476ffdd307a762beb387d9f3da0ae1/321428-original.jpg' }} />

                <VStack flex={1}>
                    <Heading fontSize="lg" color="white" numberOfLines={2}>Macarrão à carbonara</Heading>
                    <Text fontSize="sm" color="gray.200" marginTop={1}>por Luiza Cintra</Text>
                </VStack>

            <Icon as={Entypo} name="chevron-thin-right" color="gray.300"/>
            </HStack>
        </TouchableOpacity>
    );
}