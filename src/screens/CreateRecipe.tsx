import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ScreenHeader } from "@components/ScreenHeader";
import {
  VStack,
  Select,
  Text,
  Switch,
  ScrollView,
  HStack,
  useToast,
  TextArea,
  Image,
  Heading,
  Box,
  Icon,
} from "native-base";

import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { CategoryDTO } from "@dtos/CategoryDTO";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import { RecipeDTO } from "@dtos/RecipeDTO";
import { Loading } from "@components/Loading";

const PHOTO_SIZE = 200;

type FormDataProps = {
  name: string;
  description: string;
  category: string;
  ingredients: string;
  howTo: string;
  privateRecipe: boolean;
};

const recipeSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  description: yup.string().required("Informe a descrição."),
  category: yup.string().required("Informe a categoria."),
  ingredients: yup.string().required("Informe os ingredientes."),
  howTo: yup.string().required("Informe o modo de preparo."),
  privateRecipe: yup.boolean().required(),
});

type RouteParamsProps = {
  recipeId: string;
};

export function CreateRecipe() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [sendingRecipe, setSendingRecipe] = useState(false);
  const [recipeIsLoading, setRecipeIsLoading] =  useState(false);
  const [photoIsLoading, setphotoIsLoading] = useState(false);
  const [recipePhoto, setRecipePhoto] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW1MGZnElSlbEl-qw6RgCCmLcSDrjfz2N8g&usqp=CAU"
  );

  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();

  const route = useRoute();
  const [recipe, setRecipe] = useState<RecipeDTO>({} as RecipeDTO);
  const firstRender = useRef(true);

  const defaultFormValues = {
    name: "",
    description: "",
    category: "",
    ingredients: "",
    howTo: "",
    privateRecipe: false,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataProps>({
    defaultValues: defaultFormValues,
    resolver: yupResolver(recipeSchema),
  });


function handleCancel(){
  reset(defaultFormValues);
}

  async function handleCreateRecipe({
    name,
    description,
    category,
    howTo,
    ingredients,
    privateRecipe,
  }: FormDataProps) {
    try {
      setSendingRecipe(true);
      const response = await api.post(`/recipes`, {
        name,
        description,
        time: "",
        servings: "rgegr",
        privacy: privateRecipe,
        level: "",
        howto: howTo,
        ingredients,
        id_category: category,
        id_user: user.id,
      });

      toast.show({
        title: response.data.message,
        placement: "top",
        duration: 3000,
        bgColor: "green.700",
      });

      navigation.navigate("mediasRecipe", {
        recipeId: response.data.recipe.id,
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível cadastrar a receita.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    if (errors.ingredients) {
      toast.show({
        title: errors.ingredients?.message,
        placement: "top",
        duration: 3000,
        bgColor: "red.700",
      });
    }

    if (errors.howTo) {
      toast.show({
        title: errors.howTo?.message,
        placement: "top",
        duration: 3000,
        bgColor: "red.700",
      });
    }
  }, [errors]);

  async function fetchCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as categorias.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    reset(defaultFormValues);
    if (firstRender.current) {
      fetchCategories();
      firstRender.current = false;
    }
  }, []);

  const fetchRecipeDetails = useCallback(
    async (params: RouteParamsProps) => {
      try {
        setRecipeIsLoading(true);
        const response = await api.get(`/recipes/${params.recipeId}`);
        const { data: currentRecipe } = response;

        reset({
          name: currentRecipe.name,
          description: currentRecipe.description,
          category: currentRecipe.id_category,
          ingredients: currentRecipe.ingredients,
          howTo: currentRecipe.howto,
          privateRecipe: currentRecipe.privacy,
        });
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
      }
      finally{
        setRecipeIsLoading(false);
      }
    },
    [route, categories]
  );

  useEffect(() => {
    if (route.params) {
      const params = route.params as RouteParamsProps;
      fetchRecipeDetails(params);
    }
  }, [route, categories]);

  return (
    <VStack flex={1}>
      <ScreenHeader title={recipe.id ? "Editar receita" : "Nova receita"} />
      {recipeIsLoading ? <Loading /> : 
      <ScrollView>
        <VStack paddingX={8} paddingY={5} space={3}>
          <Box
            borderColor={"gray.400"}
            borderWidth={2}
            padding={3}
            borderRadius={"md"}
            alignContent={"space-between"}
          >
            <HStack space={2}>
              <Button
                flex={1}
                onPress={() => setShowIngredientsModal(true)}
                size={24}
                title="Ingredientes"
                variant={"outline"}
                endIcon={
                  <Icon
                    name="food-takeout-box-outline"
                    as={MaterialCommunityIcons}
                    color={"green.700"}
                  />
                }
              />
              <Button
                flex={1}
                onPress={() => setShowHowToModal(true)}
                size={24}
                title="Preparo"
                variant={"outline"}
                endIcon={
                  <Icon
                    name="post-add"
                    as={MaterialIcons}
                    color={"green.700"}
                  />
                }
              />
            </HStack>
          </Box>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome da receita"
                bg={"gray.600"}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => (
              <TextArea
                onChangeText={onChange}
                value={value}
                placeholder="Breve descrição"
                autoCompleteType={undefined}
                maxLength={80}
                bg={"gray.600"}
                width={"full"}
                height={"24"}
                fontSize="md"
                color="white"
                fontFamily="body"
                placeholderTextColor="gray.300"
                _focus={{
                  bg: "gray.700",
                  borderWidth: 1,
                  borderColor: "green.500",
                }}
              />
            )}
          />
          <Text color={"red.500"}>{errors.description?.message}</Text>

          <Controller
            control={control}
            name="category"
            render={({ field: { value, onChange } }) => (
              <Select
                selectedValue={value}
                minWidth="200"
                accessibilityLabel="Escolha a Categoria"
                placeholder="Escolha a Categoria"
                bg={"white"}
                onValueChange={onChange}
                _selectedItem={{ color: "white", bgColor: "white" }}
              >
                {categories.map((item) => {
                  return (
                    <Select.Item
                      key={item.id}
                      label={item.description}
                      value={item.id}
                    />
                  );
                })}
              </Select>
            )}
          />
          <Text color={"red.500"}>{errors.category?.message}</Text>

          <HStack
            alignItems="center"
            space={2}
            bg={"gray.600"}
            borderRadius={"md"}
          >
            <Controller
              control={control}
              name="privateRecipe"
              render={({ field: { value, onChange } }) => (
                <>
                  <Switch size="md" onValueChange={onChange} value={value} />
                  <Text color={"white"} fontWeight={"bold"} fontSize={"md"}>
                    Privada
                  </Text>
                </>
              )}
            />
          </HStack>

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

              <Controller
                control={control}
                name="ingredients"
                render={({ field: { value, onChange } }) => (
                  <TextArea
                    onChangeText={onChange}
                    value={value}
                    placeholder="Descreva os ingredientes da receita"
                    autoCompleteType={undefined}
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
                )}
              />
              <Button
                onPress={() => setShowIngredientsModal(false)}
                title="Salvar"
                variant={"solid"}
              />
            </VStack>
          </Modal>

          <Modal
            presentationStyle="formSheet"
            animationType="slide"
            visible={showHowToModal}
            onRequestClose={() => {
              setShowHowToModal(false);
            }}
          >
            <VStack padding={8} bg={"gray.400"} height={"full"}>
              <Heading
                color="gray.100"
                fontSize="lg"
                fontFamily={"heading"}
                marginBottom={6}
              >
                Modo de Preparo
              </Heading>

              <Controller
                control={control}
                name="howTo"
                render={({ field: { value, onChange } }) => (
                  <TextArea
                    onChangeText={onChange}
                    value={value}
                    placeholder="Descreva o modo de preparo da receita"
                    autoCompleteType={undefined}
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
                )}
              />

              <Button
                onPress={() => setShowHowToModal(false)}
                title="Salvar"
                variant={"solid"}
              />
            </VStack>
          </Modal>

          <HStack space={2}>
            <Button
              flex={1}
              onPress={handleSubmit(handleCreateRecipe)}
              size={24}
              title="Salvar"
              variant={"solid"}
              isLoading={sendingRecipe}
            />

            <Button flex={1} size={24} title="Cancelar" onPress={handleCancel} variant={"solid"} />
          </HStack>
        </VStack>
      </ScrollView>
}
    </VStack>
  );
}
