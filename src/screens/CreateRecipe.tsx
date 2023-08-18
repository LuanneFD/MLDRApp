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

import { useEffect, useState } from "react";
import { TouchableOpacity, Modal, TextInput } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { CategoryDTO } from "@dtos/CategoryDTO";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";

const PHOTO_SIZE = 200;

type FormDataProps = {
  name: string;
  description: string;
  category: string;
};

const recipeSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  description: yup.string().required("Informe a descrição."),
  category: yup.string().required("Informe a categoria."),
});

export function CreateRecipe() {
  const [ingredients, setIngredients] = useState("");
  const [howTo, setHowTo] = useState("");
  const [privateRecipe, setPrivateRecipe] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [sendingRecipe, setSendingRecipe] = useState(false);
  const [photoIsLoading, setphotoIsLoading] = useState(false);
  const [recipePhoto, setRecipePhoto] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW1MGZnElSlbEl-qw6RgCCmLcSDrjfz2N8g&usqp=CAU"
  );
  const [recipeId, setRecipeId] = useState("");

  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(recipeSchema),
  });

  async function handleCreateRecipe({
    name,
    description,
    category,
  }: FormDataProps) {
    if (ingredients === "") {
      toast.show({
        title: "Informe os ingredientes.",
        placement: "top",
        duration: 3000,
        bgColor: "red.700",
      });

      return;
    }

    if (howTo === "") {
      toast.show({
        title: "Informe o preparo.",
        placement: "top",
        duration: 3000,
        bgColor: "red.700",
      });
      return;
    }

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
        ingredients: ingredients,
        id_category: category,
        id_user: user.id,
      });

      toast.show({
        title: response.data.message,
        placement: "top",
        duration: 3000,
        bgColor: "green.700",
      });

      setRecipeId(response.data.recipe.id);
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
    } finally {
      setSendingRecipe(false);
      console.log(recipeId);
      //enviar para a tela de detalhes da receita com seu id que foi gerado.
      navigation.navigate("recipeDetails", { recipeId });
    }
  }

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

  function handleMediasRecipe(){
    navigation.navigate("mediasRecipe");
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Nova Receita" />
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

              <Button
                flex={1}
                onPress={handleMediasRecipe}
                size={24}
                title="Mídias"
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
            <Switch
              size="md"
              onValueChange={setPrivateRecipe}
              value={privateRecipe}
            />
            <Text color={"white"} fontWeight={"bold"} fontSize={"md"}>
              Privada
            </Text>
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

              <TextArea
                onChangeText={setIngredients}
                value={ingredients}
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

              <TextArea
                onChangeText={setHowTo}
                value={howTo}
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

              <Button
                onPress={() => setShowHowToModal(false)}
                title="Salvar"
                variant={"solid"}
              />
            </VStack>
          </Modal>

          <Button
            flex={1}
            onPress={handleSubmit(handleCreateRecipe)}
            size={24}
            title="Salvar"
            variant={"solid"}
            isLoading={sendingRecipe}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
