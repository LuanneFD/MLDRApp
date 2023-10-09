import {
  VStack,
  Image,
  Text,
  HStack,
  Heading,
  Icon,
  useToast,
  Skeleton,
  FlatList,
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
import * as FileSystem from "expo-file-system";
import { MediaDTO } from "@dtos/MediaDTO";
import { RecipeDTO } from "@dtos/RecipeDTO";
import noImage from "@utils/noImage.png";
import { RecipePhotoImage } from "@components/RecipePhotoImage";

type RouteParamsProps = {
  recipeId: string;
};

export function MediasRecipe() {
  const natigation = useNavigation<AppNavigatorRoutesProps>();
  const [medias, setMedias] = useState<MediaDTO[]>([]);
  const [imageOne, setImageOne] = useState<MediaDTO>({} as MediaDTO);
  const [imageTwo, setImageTwo] = useState<MediaDTO>({} as MediaDTO);
  const [recipe, setRecipe] = useState<RecipeDTO>({} as RecipeDTO);
  const toast = useToast();
  const [coverImageIsLoading, setcoverImageIsLoading] = useState(false);
  const [imageOneIsLoading, setImageOneIsLoading] = useState(false);
  const [imageTwoIsLoading, setImageTwoIsLoading] = useState(false);

  const route = useRoute();
  const { recipeId } = route.params as RouteParamsProps;

  useEffect(() => {
    getMedias();
    getRecipe();
  }, []);
 
  const getMedias = async () => {
    const response = (await api.get(`/medias/${recipeId}`)).data;

    setMedias(response.medias);

    if (response.medias.length == 1) setImageOne(response.medias[0]);
    else if (response.medias.length == 2) {
      setImageOne(response.medias[0]);
      setImageTwo(response.medias[1]);
    }
  };

  const getRecipe = async () => {
    const response = await api.get(`/recipes/${recipeId}`);
    setRecipe(response.data);
  };

  function getCurrentDate() {
    return new Date()
      .toLocaleString()
      .replaceAll("/", "")
      .replaceAll(" ", "")
      .replaceAll(":", "");
  }

  async function handlePhotoSelect() {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true,
    });

    if (photoSelected.canceled) {
      return;
    }

    if (photoSelected.assets[0].uri) {
      const photoInfo = await FileSystem.getInfoAsync(
        photoSelected.assets[0].uri
      );

      if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
        return toast.show({
          title: "A imagem deve ter no máximo 5MB",
          placement: "top",
          duration: 3000,
          bgColor: "red.500",
        });
      }

      const fileExtension = photoSelected.assets[0].uri.split(".").pop();
      const photoFile = {
        name: `${getCurrentDate()}.${fileExtension}`.toLowerCase(),
        uri: photoSelected.assets[0].uri,
        type: `${photoSelected.assets[0].type}/${fileExtension}`,
      } as any;

      const recipePhotoUploadForm = new FormData();
      recipePhotoUploadForm.append("file", photoFile);

      return recipePhotoUploadForm;
    }
  }

  async function UpdateCoverImage() {
    setcoverImageIsLoading(true);
    try {
      const recipePhotoUploadForm = await handlePhotoSelect();
      const recipeUpdatedResponse = await api.patch(
        `/recipes/img/${recipeId}`,
        recipePhotoUploadForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      recipe.cover_image = recipeUpdatedResponse.data.cover_image;

      toast.show({
        title: "Foto de capa adicionada!",
        placement: "top",
        bgColor: "red.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível adicionar a foto de capa.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setcoverImageIsLoading(false);
    }
  }

  async function UpdateRecipeImageOne() {
    setImageOneIsLoading(true);
    await UpdateRecipeImage("1");
    setImageOneIsLoading(false);
  }

  async function UpdateRecipeImageTwo() {
    setImageTwoIsLoading(true);
    await UpdateRecipeImage("2");
    setImageTwoIsLoading(false);
  }

  async function UpdateRecipeImage(param: string) {
    try {
      const recipePhotoUploadForm = await handlePhotoSelect();
      const recipeUpdatedResponse = await api.post(
        `/medias/${recipeId}`,
        recipePhotoUploadForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (param == "1") setImageOne(recipeUpdatedResponse.data);
      else if (param == "2") setImageTwo(recipeUpdatedResponse.data);

      toast.show({
        title: "Imagem adicionada com sucesso!",
        placement: "top",
        bgColor: "red.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível adicionar a imagem.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  function handleRecipeRegister() {
    natigation.navigate("userRecipes");
  }

  function handleCancel() {
    natigation.navigate("home");
  }

  function handleGoBack() {
    natigation.goBack();
  }

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
          <Icon as={Feather} name="arrow-left" color={"red.500"} size={6} />
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
          <RecipePhotoImage
            onPress={UpdateCoverImage}
            isLoading={coverImageIsLoading}
            sourceImage={recipe.cover_image}
            widthSize={"full"}
          />

          <HStack justifyContent={"space-between"}>
            <RecipePhotoImage
              onPress={UpdateRecipeImageOne}
              isLoading={imageOneIsLoading}
              sourceImage={imageOne ? imageOne.file_name : ""}
              widthSize={40}
            />
            <RecipePhotoImage
              onPress={UpdateRecipeImageTwo}
              isLoading={imageTwoIsLoading}
              sourceImage={imageTwo ? imageTwo.file_name : ""}
              widthSize={40}
            />
          </HStack>

          <HStack space={2}>
            <Button
              flex={1}
              size={24}
              title="Finalizar"
              variant={"solid"}
              onPress={handleRecipeRegister}
            />
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
