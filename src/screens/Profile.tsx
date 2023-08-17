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

// confirm_Password: yup
// .string()
// .oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere.')
// .when('password', {
//     is: (Field: any) => Field,
//     then: yup.string().nullable().required('Confirme a senha.')
//     .transform((value) => !!value ? value : null)
// })
// });

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


    async function handleuserPhotoSelect() {
        setphotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true
            });

            if (photoSelected.canceled) {
                return;
            }

            if (photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

                if (photoInfo.exists && photoInfo.size > 1024 * 1024 * 1) {
                    return toast.show({
                        title: 'A imagem deve ter no máximo 3MB',
                        placement: 'top',
                        duration: 3000,
                        bgColor: 'red.500',
                    });
                }

                const fileExtension = photoSelected.assets[0].uri.split('.').pop();
                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase(),
                    uri : photoSelected.assets[0].uri,
                    type : `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;

                //setUserPhoto(photoSelected.assets[0].uri);
                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                await api.put(`/recipes/img/${user.id}` , userPhotoUploadForm, {
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                });

                toast.show({
                    title : 'Foto atualizada!',
                    placement: 'top',
                    bgColor: 'green.500'
                });
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setphotoIsLoading(false);
        }
    }

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
                bgColor: 'green.500'
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
                <Center >
                    {
                        photoIsLoading ?
                            <Skeleton height={PHOTO_SIZE} width={PHOTO_SIZE} rounded={'full'} startColor="gray.500" endColor="gray.400" />
                            :
                            <ProfilePhoto alt="foto do usuário" source={{ uri: userPhoto }} size={PHOTO_SIZE} />
                    }

                    <TouchableOpacity onPress={handleuserPhotoSelect}>
                        <Text color="green.500" fontWeight={'bold'} fontSize={'md'} marginBottom={8}>Alterar foto</Text>
                    </TouchableOpacity>
                </Center>

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