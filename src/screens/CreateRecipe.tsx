import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { RecipePhoto } from '@components/RecipePhoto';
import { ScreenHeader } from '@components/ScreenHeader';
import { VStack, Skeleton, Text, Center, ScrollView, HStack, useToast, TextArea, Box, Heading } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity, Modal, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { border } from 'native-base/lib/typescript/theme/styled-system';
import { FunctionToggleMenu } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

const PHOTO_SIZE = 200;

export function CreateRecipe() {
    const [photoIsLoading, setphotoIsLoading] = useState(false);
    const [recipePhoto, setRecipePhoto] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW1MGZnElSlbEl-qw6RgCCmLcSDrjfz2N8g&usqp=CAU');
    const [showModal, setShowModal] = useState(false);
    const toast = useToast();

    async function handleRecipePhotoSelect() {
        setphotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if (!photoSelected.canceled && photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

                if (photoInfo.exists && photoInfo.size > 1024 * 1024 * 1) {
                    return toast.show({
                        title: 'A imagem deve ter no máximo 3MB',
                        placement: 'top',
                        duration: 3000,
                        bgColor: 'red.500',
                    });
                }
                setRecipePhoto(photoSelected.assets[0].uri);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setphotoIsLoading(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScrollView>
                <ScreenHeader title="Nova Receita" />

                <Center>
                    {
                        photoIsLoading ?
                            <Skeleton height={PHOTO_SIZE} startColor="gray.500" endColor="gray.400" />
                            :
                            <RecipePhoto alt="foto da receita" source={{ uri: recipePhoto }} size={PHOTO_SIZE} />
                    }

                    <TouchableOpacity onPress={handleRecipePhotoSelect}>
                        <Text color="green.500" fontWeight={'bold'} fontSize={'md'} marginBottom={8}>Alterar Imagem</Text>
                    </TouchableOpacity>
                </Center>

                <VStack paddingX={8} paddingY={5} bg={'gray.600'} space={1}>
                    <Input placeholder='Nome da receita' />
                    <TextArea placeholder='Breve descrição'
                        autoCompleteType={undefined}
                        maxLength={80}

                        width={'full'}
                        height={'24'}
                        fontSize="md"
                        color="white"
                        fontFamily="body"
                        bg="gray.700" marginBottom={4}
                        placeholderTextColor="gray.300"
                        _focus={{
                            bg: "gray.700",
                            borderWidth: 1,
                            borderColor: "green.500"
                        }}>
                        hgethrthrththrhrthrt
                    </TextArea>

                    <Input placeholder='Url vídeo' />

                    <Modal presentationStyle='formSheet'
                        animationType="slide"
                        visible={showModal}
                        onRequestClose={() => {

                            setShowModal(false);
                        }}>

                        <VStack padding={8} bg={'gray.400'} height={'full'}>
                            <Heading color="gray.100" fontSize="lg" fontFamily={'heading'}>Ingredientes</Heading>

                            <TextArea placeholder='Descreva os ingredientes da receita'
                                autoCompleteType={undefined}
                                width={'full'}
                                height={'64'}
                                fontSize="md"
                                color="white"
                                fontFamily="body"
                                bg="gray.700" marginBottom={4}
                                placeholderTextColor="gray.300"
                                _focus={{
                                    bg: "gray.700",
                                    borderWidth: 1,
                                    borderColor: "green.500"
                                }}>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum culpa pariatur voluptatum adipisci? Similique eos at illo aliquid harum, sit ut quam excepturi molestias aperiam commodi eaque qui sapiente non.
                            </TextArea>

                            <Button onPress={() => setShowModal(false)} title='Salvar' variant={'solid'} />

                        </VStack>

                    </Modal>

                    <HStack justifyContent={'space-between'}>
                        <Button onPress={() => setShowModal(true)} size={32} title='Ingredientes' variant={'outline'} />
                        <Button onPress={() => setShowModal(true)} size={32} title='Preparo' variant={'outline'} />
                    </HStack>
                </VStack>

            </ScrollView>
        </VStack>
    );
}

