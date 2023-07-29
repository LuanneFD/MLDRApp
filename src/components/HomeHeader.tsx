import {HStack, Text, VStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '@hooks/useAuth';

export function HomeHeader() {

    const {user, signOut} = useAuth();
    return (
        <HStack backgroundColor="gray.600" paddingTop={16} paddingBottom={5} paddingX={8} alignItems="center">

            <VStack flex={1}>
                <Text color="gray.100" fontSize="md" fontFamily={'heading'}>Olá, {user.name}</Text>
            </VStack>

            <TouchableOpacity onPress={signOut}>
                <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
            </TouchableOpacity>
             
        </HStack>
    );
}