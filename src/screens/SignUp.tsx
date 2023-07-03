import { useNavigation } from '@react-navigation/native'
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';

import BackGroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignUp() {

    const navigation = useNavigation();

    function handleGoBack(){
        navigation.goBack();
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
                        Crie sua conta
                    </Heading>

                    <Input
                        placeholder='Nome' />
                    <Input
                        placeholder='E-mail'
                        keyboardType='email-address'
                        autoCapitalize='none' />

                    <Input placeholder='Senha' secureTextEntry />
                    <Button title="Criar e acessar" />
                </Center>

                <Button marginTop={24} title="Voltar para o login" variant="outline" onPress={handleGoBack} />

            </VStack>
        </ScrollView>
    );
}