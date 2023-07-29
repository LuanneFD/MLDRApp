import { HStack, Heading, Image, Text, VStack,Icon } from 'native-base';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import {Entypo} from '@expo/vector-icons';
import { RecipeDTO } from '@dtos/RecipeDTO';

type Props = TouchableOpacityProps & {
    data: RecipeDTO;
};

export function RecipeCard({data, ...rest }: Props) {
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
                    source={{ uri: data.cover_image }} />

                <VStack flex={1}>
                    <Heading fontSize="lg" color="white" numberOfLines={2}>{data.name}</Heading>
                    <Text fontSize="sm" color="gray.200" marginTop={1}>por {data.user.name}</Text>
                </VStack>

            <Icon as={Entypo} name="chevron-thin-right" color="gray.300"/>
            </HStack>
        </TouchableOpacity>
    );
}