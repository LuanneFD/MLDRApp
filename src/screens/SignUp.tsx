import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { VStack, Image, Text, Center, Heading, ScrollView,Switch, HStack } from 'native-base';

import BackGroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';


type FormDataProps = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const signUpSchema = yup.object({
name: yup.string().required('Informe o nome.'),
email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
password: yup.string().required('Informe a senha.').min(6,'A senha deve ter pelo menos 6 dígitos.'),
confirmPassword :  yup.string().required('Confirme a senha.').oneOf([yup.ref('password'),''],'A confirmação da senha não confere.')
});

export function SignUp() {

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const navigation = useNavigation();
    function handleGoBack() {
        navigation.goBack();
    }

    function hadleSignUp(data: FormDataProps) {

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

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message} />)}
                    />

<HStack alignItems={'center'} alignContent={'space-between'}>
<Switch onTrackColor="green.500" onThumbColor="green.400" offTrackColor="gray.500"  offThumbColor="gray.100" size="md" />
<Text color={'white'}>Perfil Profissional</Text>
</HStack>

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


                    <Button title="Criar e acessar" onPress={handleSubmit(hadleSignUp)} />
                </Center>

                <Button marginTop={16} title="Voltar para o login" variant="outline" onPress={handleGoBack} />

            </VStack>
        </ScrollView>
    );
}