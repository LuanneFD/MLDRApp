import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';

import { api } from '@services/api';
import BackGroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';



type FormDataProps = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const type = 'A';

const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    confirmPassword: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere.')
});

export function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const {signIn} = useAuth();
    const toast = useToast();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack();
    }

    async function hadleSignUp({ name, email, password }: FormDataProps) {

        try {
            setIsLoading(true);
            await api.post('/users', { name, email, type, password });
            await signIn(email, password);
        }
        catch (error) {
            setIsLoading(false);
            
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.'
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
                <Center marginTop={'48'}>    
                    <Text color="gray.100" fontSize="xl">Meu Livro de Receitas</Text>
                </Center>
                <Center>
                    <Heading color="gray.100" fontSize="xl" marginBottom={6} fontFamily="heading">
                        Crie sua Conta
                    </Heading>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message} />)}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                onChangeText={onChange} value={value}
                                placeholder='E-mail'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                errorMessage={errors.email?.message} />)}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input placeholder='Senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message} />)}
                    />

                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, value } }) => (
                            <Input placeholder='Confirme a Senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(hadleSignUp)}
                                returnKeyType='send'
                                errorMessage={errors.confirmPassword?.message} />)}
                    />


                    <Button title="Criar e Acessar" onPress={handleSubmit(hadleSignUp)} isLoading={isLoading} />
                </Center>

                <Button marginTop={10} title="Voltar para o Login" variant="outline" onPress={handleGoBack} />

            </VStack>
            </ScrollView>
    );
}