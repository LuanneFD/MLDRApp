import {
  HStack,
  Heading,
  Icon,
  VStack,
  Image,
  TextArea,
  Box,
  Text,
  ScrollView,
  IconButton,
  useToast,
  Center,
} from "native-base";
import { Modal, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useCallback, useEffect, useState } from "react";
import { RecipeDTO } from "@dtos/RecipeDTO";
import { Loading } from "@components/Loading";
import { useAuth } from "@hooks/useAuth";
import * as Linking from "expo-linking";
import { Share } from "react-native";
import { Button } from "@components/Button";
import noImage from "@utils/noImage.png";

type RouteParamsProps = {
  recipeId: string;
};

export function RecipeDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const natigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { recipeId } = route.params as RouteParamsProps;
  const toast = useToast();
  const [recipe, setRecipe] = useState<RecipeDTO>({} as RecipeDTO);
  const { user } = useAuth();
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [photosIsLoading, setPhotosIsLoading] = useState(false);
  const [medias, setMedias] = useState([]);
  function handleGoBack() {
    natigation.goBack();
  }

  async function handleShare() {
    try {
      const result = await Share.share({
        message: `Confira a receita ${recipe.name}! Baixe agora o aplicativo Meu Livro de Receitas e veja todos os detalhes ;)`,
      });
    } catch (error) {
      toast.show({
        title: "Não foi possível compartilhar a receita.",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  function handleEditRecipe() {
    let recipeId = recipe.id;
    natigation.navigate("createRecipe", { recipeId });
  }

  function handleIngredients() {
    setShowIngredientsModal(true);
  }

  async function handleDeleteRecipe() {
    try {
      await api.delete(`/recipes/${recipeId}`);

      toast.show({
        title: "Receita excluída com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      natigation.navigate("userRecipes");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível excluir a receita.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchRecipeDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/recipes/${recipeId}`);
      setRecipe(response.data);
      console.log(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar a receita.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMediasRecipe(){
    try {
      setPhotosIsLoading(true);
      const response = await api.get(`/medias/${recipeId}`);
      setMedias(response.data.medias);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as imagens.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setPhotosIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  useFocusEffect(useCallback(() => {
    fetchMediasRecipe();
  }, []));

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
          {recipe.name}
        </Heading>
        <TouchableOpacity onPress={handleShare}>
          <Icon
            as={Ionicons}
            name="md-share-social-outline"
            color={"green.500"}
            size={6}
          />
        </TouchableOpacity>
      </HStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView>
          <VStack>
            {recipe.cover_image != null ? (
              <Image
                width={"full"}
                height={40}
                alt="Imagem da receita"
                resizeMode="cover"
                rounded={"lg"}
                marginBottom={6}
                source={{ uri: recipe.cover_image }}
              />
            ) : (
              <Center
                borderColor={"gray.600"}
                borderWidth={"2"}
                marginBottom={6}
              >
                <Image
                  width={40}
                  height={40}
                  alt="Imagem da receita"
                  resizeMode="cover"
                  rounded={"lg"}
                  source={noImage}
                />
              </Center>
            )}

            <HStack justifyContent={"center"} space={2}>
              <IconButton
                onPress={handleIngredients}
                size={"lg"}
                colorScheme="green"
                variant={"solid"}
                _icon={{ as: MaterialCommunityIcons, name: "food-variant" }}
              />
              <IconButton
                size={"lg"}
                colorScheme="green"
                variant={"solid"}
                _icon={{ as: MaterialIcons, name: "video-library" }}
                onPress={() =>
                  Linking.openURL("https://www.youtube.com/watch?v=FDvmmUZezAw")
                }
              />
              <IconButton
                size={"lg"}
                colorScheme="green"
                variant={"solid"}
                _icon={{ as: FontAwesome5, name: "photo-video" }}
                onPress={() => setShowPhotosModal(true)}
              />
              {recipe.user.id === user.id && (
                <>
                  <IconButton
                    size={"lg"}
                    colorScheme="green"
                    variant={"solid"}
                    _icon={{ as: AntDesign, name: "edit" }}
                    onPress={handleEditRecipe}
                  />
                  <IconButton
                    size={"lg"}
                    colorScheme="green"
                    variant={"solid"}
                    _icon={{ as: MaterialIcons, name: "delete" }}
                    onPress={handleDeleteRecipe}
                  />
                </>
              )}
            </HStack>

            <Text
              marginTop={6}
              marginBottom={6}
              textAlign={"center"}
              fontSize={"md"}
              color={"gray.200"}
            >
              Modo de preparo
            </Text>

            <Box
              paddingX={4}
              borderWidth={3}
              backgroundColor={"gray.600"}
              borderColor={"gray.500"}
              width={"full"}
              height={"full"}
            >
              <Text color={"white"} fontSize={"md"} textAlign={"left"}>
                {recipe.howto}
              </Text>
            </Box>
          </VStack>
        </ScrollView>
      )}

      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        visible={showIngredientsModal}
        onRequestClose={() => {
          setShowIngredientsModal(false);
        }}
      >
        <VStack padding={8} bg={"gray.400"} height={"full"}>
          <Heading
            color="gray.100"
            fontSize="lg"
            fontFamily={"heading"}
            marginBottom={6}
          >
            Ingredientes
          </Heading>
          <TextArea
            value={recipe.ingredients}
            autoCompleteType={undefined}
            isDisabled={true}
            flex={1}
            fontSize="md"
            color="white"
            fontFamily="body"
            bg="gray.700"
            marginBottom={4}
            placeholderTextColor="gray.300"
            _focus={{
              bg: "gray.700",
              borderWidth: 1,
              borderColor: "green.500",
            }}
          />
          <Button
            onPress={() => setShowIngredientsModal(false)}
            title="Fechar"
            variant={"solid"}
          />
        </VStack>
      </Modal>

      <Modal
        presentationStyle="formSheet"
        animationType="slide"
        visible={showPhotosModal}
        onRequestClose={() => {
          setShowPhotosModal(false);
        }}
      >
        <VStack padding={8} bg={"gray.400"} height={"full"}>
          <Heading
            color="gray.100"
            fontSize="lg"
            fontFamily={"heading"}
            marginBottom={6}
          >
            Imagens
          </Heading>

       
            <Center borderColor={"gray.600"} borderWidth={"2"} marginBottom={6}>
            {medias.filter(m => m.type != '1').map(media => (<Image
                width={40}
                height={40}
                alt="Imagem da receita"
                resizeMode="cover"
                rounded={"lg"}
                source={media}
              />))
       }

              
            </Center>          
          <Button
            onPress={() => setShowPhotosModal(false)}
            title="Fechar"
            variant={"solid"}
          />
        </VStack>
      </Modal>
    </VStack>
  );
}
