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


const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
    confirmPassword: yup.string().oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere.').nullable().transform((value) => !!value ? value : null)
});

export function Profile() {

    const [photoIsLoading, setphotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW1MGZnElSlbEl-qw6RgCCmLcSDrjfz2N8g&usqp=CAU');
    const toast = useToast();
    const { user } = useAuth();

    const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
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

            if (!photoSelected.canceled && photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

                if (photoInfo.exists && photoInfo.size > 1024 * 1024 * 1) {
                    return toast.show({
                        title: 'A imagem deve ter no máximo 3MB',
                        placement: 'top',
                        duration: 3000,
                        bgColor: 'red.500',
                    });
                }
                setUserPhoto(photoSelected.assets[0].uri);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setphotoIsLoading(false);
        }
    }

    async function handleProfileUpdate(data: FormDataProps) {

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
                        name="confirm_password"
                        render={({ field: { onChange } }) => (
                            <Input bg={'gray.600'} placeholder='Confirmar senha' secureTextEntry onChangeText={onChange} errorMessage={errors.confirm_password?.message} />
                        )}
                    />

                    <Button title='Atualizar' marginTop={4} onPress={handleSubmit(handleProfileUpdate)} />
                </VStack>
            </ScrollView>
        </VStack>
    );
}