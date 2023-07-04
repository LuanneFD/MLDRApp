import { Center, Icon, Text, VStack } from 'native-base';
import { TouchableOpacity } from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes';

export function RecipeDetails() {
const natigation = useNavigation<AppNavigatorRoutesProps>();

function handleGoBack(){
    natigation.goBack();
}
    return (
        <VStack flex={1}>
        <VStack paddingX={8} bg={'gray.600'} paddingTop={12}>
            <TouchableOpacity onPress={handleGoBack}>
                <Icon as={Feather} name="arrow-left" color={'green.500'} size={6}/>
            </TouchableOpacity>
        </VStack>

        </VStack>
    );
}