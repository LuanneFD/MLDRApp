import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ScreenHeader } from '@components/ScreenHeader';
import { VStack, Skeleton, Text, Center, ScrollView, HStack, useToast, TextArea, Box, Heading } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity, Modal, TextInput } from 'react-native';

import { border } from 'native-base/lib/typescript/theme/styled-system';
import { FunctionToggleMenu } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

const PHOTO_SIZE = 200;

export function CreateRecipe() {
    const [sendingRecipe, setSendingRecipe] = useState(false);
    const [photoIsLoading, setphotoIsLoading] = useState(false);
    const [recipePhoto, setRecipePhoto] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW1MGZnElSlbEl-qw6RgCCmLcSDrjfz2N8g&usqp=CAU');
    const [showModal, setShowModal] = useState(false);
    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    async function handleCreateRecipe(){
        //setSendingRecipe(true); descomentar depois

        toast.show({
            title: 'Receita cadastrada com sucesso!',
            placement: 'top',
            duration: 3000,
            bgColor: 'green.700',
        });

        const recipeId = '1';
        //enviar para a tela de detalhes da receita com seu id que foi gerado.
        navigation.navigate('recipeDetails', {recipeId});
    }

    return (
        <VStack flex={1}>
            <ScrollView>
                <ScreenHeader title="Nova Receita" />

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
                        <Button onPress={() => handleCreateRecipe()} size={32} title='Salvar' variant={'outline'} isLoading={sendingRecipe}/>
                    </HStack>
                </VStack>

            </ScrollView>
        </VStack>
    );
}

