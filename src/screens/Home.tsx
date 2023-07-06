import { useState } from 'react';
import {useNavigation} from '@react-navigation/native'
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { VStack, FlatList, Heading } from 'native-base';
import { RecipeCard } from '@components/RecipeCard';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

export function Home() {
    const [groupSelected, setGroupSelected] = useState('sobremesa');
    const [groups, SetGroups] = useState(['sobremesa', 'massa', 'carne', 'saladas', 'molhos']);
    const [recipes, setRecipes] = useState(['Brigadeiro Belga', 'Macarrão à carbonara', 'Filet Mignom']);

    const navigation = useNavigation<AppNavigatorRoutesProps>();
    function handleOpenRecipeDetails (){
        navigation.navigate('recipeDetails');
    }
    return (
        <VStack flex={1}>

            <HomeHeader />

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ paddingX: 8 }}
                marginY={10}
                maxHeight={10}
                minHeight={10}
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group name={item} isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()} onPress={() => setGroupSelected(item)} />
                )} />

            <VStack flex={1} paddingX={8}>
                <Heading color="gray.200" fontSize="lg" marginBottom={5}>Receitas</Heading>
                <FlatList
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{paddingBottom:20}}
                    data={recipes}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <RecipeCard onPress={handleOpenRecipeDetails}/>
                    )}
                />

            </VStack>
        </VStack>
    );
}