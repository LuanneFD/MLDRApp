import { RecipePhoto } from '@components/RecipePhoto';
import { ScreenHeader } from '@components/ScreenHeader';
import { VStack, Skeleton, Text } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

const PHOTO_SIZE = 200;

export function CreateRecipe() {
    const [photoIsLoading, setphotoIsLoading] = useState(false);
    return (
        <VStack flex={1}>
            <ScreenHeader title="Nova Receita" />

            {
                photoIsLoading ?
                    <Skeleton width={PHOTO_SIZE} height={PHOTO_SIZE} startColor="gray.500" endColor="gray.400" />
                    :
                    <RecipePhoto alt="foto da receita" source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW1MGZnElSlbEl-qw6RgCCmLcSDrjfz2N8g&usqp=CAU' }} size={PHOTO_SIZE} />
            }

            <TouchableOpacity>
                <Text color="green.500" fontWeight={'bold'} fontSize={'md'} marginBottom={8}>Alterar Imagem</Text>
            </TouchableOpacity>
            
        </VStack>
    );
}

