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
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { RecipeDTO } from "@dtos/RecipeDTO";
import { Loading } from "@components/Loading";

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

  function handleGoBack() {
    natigation.goBack();
  }

  function handleShare() {
    natigation.goBack();
  }

  async function fetchRecipeDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/recipes/${recipeId}`);
      console.log(recipeId);
      console.log(response.data);
      setRecipe(response.data);
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

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

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
            <Image
              width={"full"}
              height={40}
              alt="Imagem da receita"
              resizeMode="cover"
              rounded={"lg"}
              marginBottom={6}
              source={{ uri: recipe.cover_image }}
            />

            <HStack justifyContent={"center"} space={2}>
              <IconButton
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
              />
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
    </VStack>
  );
}
