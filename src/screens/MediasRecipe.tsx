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
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Feather } from "@expo/vector-icons";
import { api } from "@services/api";
import apiUpload from "@services/api-upload";
import { AppError } from "@utils/AppError";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';

type RouteParamsProps = {
  recipeId: string;
};

export function MediasRecipe() {
  const [urlVideo, setUrlVideo] = useState("");
  const natigation = useNavigation<AppNavigatorRoutesProps>();
  const [medias, setMedias] = useState([]);
  const [type, setType] = useState("");
  const toast = useToast();
  const [coverImage, setCoverImage] = useState<string | null | undefined>("");
  const [photoIsLoading, setphotoIsLoading] = useState(false);
  const [image, setImage] = useState("");

  const route = useRoute();
  const { recipeId } = route.params as RouteParamsProps;

  function handleGoBack() {
    natigation.goBack();
  }

  useEffect(() => {
    getMedias();
  }, []);

  const getMedias = async () => {
    const response = (await api.get(`/medias/${recipeId}`)).data;

    setMedias(response.medias);
  };

  
function handleCancel(){
  natigation.navigate("home");
}

  async function handlePhotoSelect() {
    setphotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);


      console.log("CAPA SELECIONADA => ");
      console.log(photoSelected.assets[0].uri.split('.'));

      //setCoverImage(photoSelected.assets[0].fileName);


      const form = new FormData();
      form.append("file", coverImage);

      const response = (await apiUpload.put(`/recipes/img/${recipeId}`, form)).data;

      toast.show({
        title: "Foto atualizada!",
        placement: "top",
        bgColor: "green.500",
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

  async function handleUploadCapa() {
    try {
      const form = new FormData();
      form.append("file", coverImage);
      const response = (await apiUpload.put(`/recipes/img/${recipeId}`, form))
        .data;

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

  async function uploadMedia() {
    try {
      const form = new FormData();

      form.append("file", image);
      form.append("id_recipe", recipeId);
      form.append("type", type);

      const response = (await apiUpload.post("/medias", form)).data;

      toast.show({
        title: response.message,
        placement: "top",
        duration: 3000,
        bgColor: "green.700",
      });

      getMedias();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível inserir a imagem.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  // async function deleteMedia() {
  //   const response = (await api.delete(`/medias/${recipeId}/${filename}`)).data;
  //   if (response.error) {
  //     toast.error(response.message);
  //   } else {
  //     toast.success(response.message);
  //   }
  //   getMedias();
  // };

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

          <TouchableOpacity onPress={handlePhotoSelect}>
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
            placeholder="Vídeo Explicativo"
            bg={"gray.600"}
          />

          <HStack space={2}>
            <Button flex={1} size={24} title="Salvar" variant={"solid"} />
            <Button
             flex={1}
             size={24}
              title="Cancelar"
              onPress={handleCancel}
              variant={"solid"}
            />
          </HStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
