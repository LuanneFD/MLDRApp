import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { RecipePhoto } from '@components/RecipePhoto';
import { ScreenHeader } from '@components/ScreenHeader';
import { VStack, Skeleton, Text, Center, ScrollView, HStack } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

const PHOTO_SIZE = 200;

export function CreateRecipe() {
    const [photoIsLoading, setphotoIsLoading] = useState(false);
    return (
        <VStack flex={1}>
            <ScrollView>
                <ScreenHeader title="Nova Receita" />

                <Center>
                    {
                        photoIsLoading ?
                            <Skeleton height={PHOTO_SIZE} startColor="gray.500" endColor="gray.400" />
                            :
                            <RecipePhoto alt="foto da receita" source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW1MGZnElSlbEl-qw6RgCCmLcSDrjfz2N8g&usqp=CAU' }} size={PHOTO_SIZE} />
                    }

                    <TouchableOpacity>
                        <Text color="green.500" fontWeight={'bold'} fontSize={'md'} marginBottom={8}>Alterar Imagem</Text>
                    </TouchableOpacity>
                </Center>

                <VStack paddingX={8} paddingY={5} bg={'gray.600'} space={1}>
                    <Input placeholder='Nome da receita' />
                    <Input placeholder='Url vídeo' />
                    <HStack paddingX={8} paddingY={5} justifyContent={'center'} space={2}>
                      <Button width={70} title='Ingredientes' variant={'outline'}/>
                      <Button width={70}  title='Preparo' variant={'outline'}/>
                    </HStack>
                </VStack>
            </ScrollView>
        </VStack>
    );
}

