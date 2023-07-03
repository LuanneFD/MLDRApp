import { useNavigation } from '@react-navigation/native'
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import BackGroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignIn() {

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    function handleNewAccount(){
        navigation.navigate('signUp');
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1} paddingX={10}>
                <Image defaultSource={BackGroundImg} source={BackGroundImg} resizeMode="contain" position='absolute' alt="Descrição da imagem (trocar depois!)" />
                <Center marginY={24}>
                    <LogoSvg />
                    <Text color="gray.100" fontSize="sm">Seu livro de receitas digital</Text>
                </Center>
                <Center>
                    <Heading color="gray.100" fontSize="xl" marginBottom={6} fontFamily="heading">
                        Acesse sua conta
                    </Heading>
                    <Input
                        placeholder='E-mail'
                        keyboardType='email-address'
                        autoCapitalize='none' />

                    <Input placeholder='Senha' secureTextEntry />
                    <Button title="Acessar" />
                </Center>

                <Center marginTop={24}>
                    <Text color="gray.100" fontSize="sm" marginBottom={3} fontFamily="body">Ainda não tem acesso?</Text>
                    <Button title="Criar conta" variant="outline" onPress={handleNewAccount} />
                </Center>
            </VStack>
        </ScrollView>
    );
}