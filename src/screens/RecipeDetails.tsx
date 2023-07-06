import { HStack, Heading, Icon, VStack, Image, TextArea, Box, Text, ScrollView, IconButton } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons  } from '@expo/vector-icons';

export function RecipeDetails() {
    const natigation = useNavigation<AppNavigatorRoutesProps>();

    function handleGoBack() {
        natigation.goBack();
    }

    function handleShare() {
        natigation.goBack();
    }
    return (
        <VStack flex={1}>

            <HStack paddingX={8} bg={'gray.600'} paddingTop={12} paddingBottom={6} marginBottom={6} >
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={Feather} name="arrow-left" color={'green.500'} size={6} />
                </TouchableOpacity>
                <Heading marginLeft={5} flex={1} color={'gray.100'} fontSize={'lg'} flexShrink={1}>Macarrão à Carbonara</Heading>
                <TouchableOpacity onPress={handleShare}>
                    <Icon as={Ionicons} name="md-share-social-outline" color={'green.500'} size={6} />
                </TouchableOpacity>
            </HStack>

            <ScrollView>
                <VStack>
                    <Image width={'full'} height={40} alt="Imagem da receita" resizeMode="cover" rounded={'lg'} marginBottom={6}
                        source={{ uri: 'https://static.itdg.com.br/images/1200-675/00476ffdd307a762beb387d9f3da0ae1/321428-original.jpg' }} />

                    <HStack justifyContent={'center'} space={2}>
                        <IconButton size={'lg'} colorScheme="green" variant={'solid'} _icon={{ as: MaterialCommunityIcons, name: "food-variant" }} />
                        <IconButton size={'lg'}  colorScheme="green" variant={'solid'} _icon={{ as: MaterialIcons, name: "video-library" }} />
                    </HStack>

                    <Text marginTop={6} marginBottom={6} textAlign={'center'} fontSize={'md'} color={'gray.200'}>Modo de preparo</Text>

                    <Box paddingX={4} borderWidth={3} backgroundColor={'gray.600'} borderColor={'gray.500'} width={'full'} height={'full'}>
                        <Text color={'white'} fontSize={'md'} textAlign={'left'}>
                            1 Frite bem o bacon, até ficar crocante (pode-se adicionar salame picado).

                            2
                            Coloque o macarrão para cozinhar em água e sal.

                            3
                            No refratário onde será servido o macarrão, bata bem os ovos com um garfo.

                            4
                            Tempere com sal e pimenta a gosto, e junte o queijo ralado, também a gosto.

                            5
                            Quando o macarrão estiver pronto, escorra e coloque (bem quente) sobre a mistura de ovos, misture bem.

                            6
                            O calor da massa cozinha os ovos.

                            7
                            Coloque o bacon, ainda quente, sobre o macarrão e sirva.fvmfgkjbnjknbjrgtbkfbfjkbnjkfbnjkfnbkjfnbkjfnbnkfgnbkjfnkbfknvvvvvvvvvvujgthbututututututututututututuhttttttttttttttttttttvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvviuvffffffffffffffffffffffffffffffffffffffffffffffffffff</Text>
                    </Box>
                </VStack>
            </ScrollView>
        </VStack>
    );
}