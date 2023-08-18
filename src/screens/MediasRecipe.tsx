import {
  VStack,
  Image,
  Text,
  HStack,
  Heading,
  Icon,
  useToast,
} from "native-base";
import { ScrollView, TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Feather } from "@expo/vector-icons";
import { api } from "@services/api";
import apiUpload from "@services/api-upload";
import { AppError } from "@utils/AppError";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export function MediasRecipe() {
  const [urlVideo, setUrlVideo] = useState("");
  const natigation = useNavigation<AppNavigatorRoutesProps>();
  const [medias, setMedias] = useState([]);
  const [type, setType] = useState("");
  const toast = useToast();
  const [coverImage, setCoverImage] = useState("");
  const [photoIsLoading, setphotoIsLoading] = useState(false);


  function handleGoBack() {
    natigation.goBack();
  }

  useEffect(() => {
    getMedias();
  }, []);

  const getMedias = async () => {
    const response = (await api.get(`/medias/1`)).data;

    setMedias(response.medias);
  };

  async function handlePhotoSelect() {
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

  async function handleUploadCapa() {
    try {
      const form = new FormData();
      form.append("file", coverImage);
      const response = (await apiUpload.put(`/recipes/img/1`, form)).data;

      toast.show({
        title: response.message,
        placement: "top",
        duration: 3000,
        bgColor: "green.700",
      });

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível inserir a foto de capa.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  const uploadMedia = async (media) => {
    const form = new FormData();

    form.append("file", media);
    form.append("id_recipe", recipe.id);
    form.append("type", type);

    const response = (await apiUpload.post("/medias", form)).data;

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
    getMedias();
  };

  const deleteMedia = async (id, filename) => {
    const response = (await api.delete(`/medias/${id}/${filename}`)).data;
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
    getMedias();
  };

  const deleteCoverImage = async () => {
    const response = (
      await api.put(`/recipes/img/delete/${recipe.id}/${recipe.cover_image}`)
    ).data;

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
    loadRecipe();
  };
  return (
    <VStack flex={1}>
      <HStack
        paddingX={8}
        bg={"gray.600"}
        paddingTop={12}
        paddingBottom={6}
        marginBottom={6}
      >
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color={"green.500"} size={6} />
        </TouchableOpacity>

        <Heading
          marginLeft={5}
          flex={1}
          color={"gray.100"}
          fontSize={"lg"}
          flexShrink={1}
        >
          Mídias da Receita
        </Heading>
      </HStack>
      <ScrollView>
        <VStack paddingX={5} paddingY={5} space={3}>
          <Image
            width={"full"}
            height={40}
            alt="Imagem da receita"
            resizeMode="cover"
            rounded={"lg"}
            source={{
              uri: "https://s2-receitas.glbimg.com/jz_7W3MwHzwPgctjvZPxCJ1T8PQ=/0x0:1280x800/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2021/w/d/pPWpQOTJus3u4DeVyADQ/bolo-de-cenoura.jpg",
            }}
          />

          <TouchableOpacity onPress={handleUploadCapa}>
            <Text
              color="green.500"
              fontWeight={"bold"}
              fontSize={"md"}
              marginBottom={8}
            >
              Adicionar foto de capa
            </Text>
          </TouchableOpacity>

          <HStack space={3} justifyContent={"space-between"}>
            <VStack>
              <Image
                width={40}
                height={40}
                alt="Imagem da receita"
                resizeMode="cover"
                rounded={"lg"}
                source={{
                  uri: "https://s2-receitas.glbimg.com/jz_7W3MwHzwPgctjvZPxCJ1T8PQ=/0x0:1280x800/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2021/w/d/pPWpQOTJus3u4DeVyADQ/bolo-de-cenoura.jpg",
                }}
              />
              <TouchableOpacity>
                <Text
                  color="green.500"
                  fontWeight={"bold"}
                  fontSize={"md"}
                  marginBottom={8}
                >
                  Adicionar Imagem
                </Text>
              </TouchableOpacity>
            </VStack>

            <VStack>
              <Image
                width={40}
                height={40}
                alt="Imagem da receita"
                resizeMode="cover"
                rounded={"lg"}
                source={{
                  uri: "https://s2-receitas.glbimg.com/jz_7W3MwHzwPgctjvZPxCJ1T8PQ=/0x0:1280x800/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2021/w/d/pPWpQOTJus3u4DeVyADQ/bolo-de-cenoura.jpg",
                }}
              />
              <TouchableOpacity>
                <Text
                  color="green.500"
                  fontWeight={"bold"}
                  fontSize={"md"}
                  marginBottom={8}
                >
                  Adicionar Imagem
                </Text>
              </TouchableOpacity>
            </VStack>
          </HStack>

          <Input
            onChangeText={setUrlVideo}
            value={urlVideo}
            placeholder="Url vídeo"
            bg={"gray.600"}
          />

          <Button title="Salvar" variant={"solid"} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
