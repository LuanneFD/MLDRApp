import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ProfilePhoto } from '@components/ProfilePhoto';
import { ScreenHeader } from '@components/ScreenHeader';
import { Center, Heading, ScrollView, Skeleton, VStack, useToast, Text } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';


const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    type: string
    password: string;
    confirm_Password: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
    confirm_Password: yup
        .string()
        .oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere.')
});

export function Profile() {

    const [isLoading, setIsLoading] = useState(false);
    const [photoIsLoading, setphotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW1MGZnElSlbEl-qw6RgCCmLcSDrjfz2N8g&usqp=CAU');
    const toast = useToast();
    const { user, updateUserProfile } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema)
    });

    async function handleProfileUpdate({ name, email, password }: FormDataProps) {
        try {
            setIsLoading(true);

            const userUpdated = user;
            userUpdated.name = name;

            await api.put(`/users/${user.id}`, { name, email, type: user.type, password });
            await updateUserProfile(userUpdated);

            toast.show({
                title: 'Perfil atualizado com sucesso!',
                placement: 'top',
                bgColor: 'red.500'
            });
        }
        catch (error) {

            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível atualizar os dados do perfil.'
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }
        finally {
            setIsLoading(false);
        }
    }


    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />
            <ScrollView contentContainerStyle={{ paddingBottom: 5 }}>
                <Center px={10}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange } }) => (
                            <Input placeholder='Nome' bg={'gray.600'} textContentType='name' onChangeText={onChange} value={value} errorMessage={errors.name?.message} />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange } }) => (
                            <Input placeholder='Email' bg={'gray.600'} isDisabled onChangeText={onChange} value={value} />
                        )}
                    />
                </Center>

                <VStack px={10} marginTop={4} mb={9}>
                    <Heading color={'gray.200'} fontSize={'md'} marginBottom={2} marginTop={5} >Alterar senha</Heading>

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange } }) => (
                            <Input bg={'gray.600'} placeholder='Nova senha' secureTextEntry onChangeText={onChange} errorMessage={errors.password?.message} />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirm_Password"
                        render={({ field: { onChange } }) => (
                            <Input bg={'gray.600'} placeholder='Confirmar senha' secureTextEntry onChangeText={onChange} errorMessage={errors.confirm_Password?.message} />
                        )}
                    />

                    <Button title='Atualizar' marginTop={4} onPress={handleSubmit(handleProfileUpdate)} isLoading={isLoading} />
                </VStack>
            </ScrollView>
        </VStack>
    );
}