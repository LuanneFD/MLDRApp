import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { Center, Heading, ScrollView, VStack } from 'native-base';

export function Profile() {
    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />
            <ScrollView contentContainerStyle={{paddingBottom: 36}}>
                <Center mt={6} px={10}>
                    <Input placeholder='Nome' bg={'gray.600'} textContentType='name' />
                    <Input placeholder='Email' bg={'gray.600'} isDisabled />
                </Center>

                <VStack px={10} marginTop={12} mb={9}>
                    <Heading color={'gray.200'} fontSize={'md'} marginBottom={2} marginTop={5} >Alterar senha</Heading>
                    <Input bg={'gray.600'}  placeholder='Senha antiga' secureTextEntry/>
                    <Input bg={'gray.600'}  placeholder='Nova senha' secureTextEntry/>
                    <Input bg={'gray.600'}  placeholder='Confirmar senha' secureTextEntry/>
                    <Button title='Atualizar' marginTop={4} />
                </VStack>
            </ScrollView>
        </VStack>
    );
}