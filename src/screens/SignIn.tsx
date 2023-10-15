import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';

import { useAuth } from '@hooks/useAuth';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import BackGroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { useState } from 'react';

type FormDataProps = {
    email: string;
    password: string;
}

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { signIn } = useAuth();
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>();

    function handleNewAccount() {
        navigation.navigate("signUp");
    }

    async function handleSignIn({ email, password }: FormDataProps) {
        try {
            setIsLoading(true);
            await signIn(email, password);

        }
        catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'E-mail ou senha incorretos.'

            setIsLoading(false);

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });

        }
    }

    return (
       
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <VStack flex={1} paddingX={10}>
                 <Image defaultSource={BackGroundImg} source={BackGroundImg}  width={'lg'} height={'full'} position='absolute' alt="Imagem de fundo" />
                <Center marginTop={'48'} >
                    <Text color="gray.100" fontSize="xl">Meu Livro de Receitas</Text>
                </Center>
                <Center>
                    <Heading color="gray.100" fontSize="xl" marginBottom={6} fontFamily="heading">
                        Acesse sua Conta
                    </Heading>

                    <Controller
                        control={control}
                        name="email"
                        rules={{ required: 'Informe o e-mail' }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                                placeholder='E-mail'
                                keyboardType='email-address'
                                autoCapitalize='none' />)}
                    />

                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: 'Informe a senha' }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                                onSubmitEditing={handleSubmit(handleSignIn)}
                                returnKeyType='send'
                                placeholder='Senha' secureTextEntry />)}
                    />

                    <Button title="Acessar" onPress={handleSubmit(handleSignIn)} isLoading={isLoading} />
                </Center>

                <Center marginTop={24}>
                    <Text color="gray.100" fontSize="sm" marginBottom={3} fontFamily="body">Ainda não tem acesso?</Text>
                    <Button title="Criar Conta" variant="outline" onPress={handleNewAccount} />
                </Center>
            </VStack>
            </ScrollView>
    );
}