import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { VStack, FlatList, Heading, useToast } from "native-base";
import { RecipeCard } from "@components/RecipeCard";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";
import { CategoryDTO } from "@dtos/CategoryDTO";
import { RecipeDTO } from "@dtos/RecipeDTO";
import { Loading } from "@components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [categorySelected, setCategorySelected] = useState("1");
  const [categories, SetCategories] = useState<CategoryDTO[]>([]);
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const { user } = useAuth();
 
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  function handleOpenRecipeDetails(recipeId: string) {
    navigation.navigate("recipeDetails", { recipeId });
  }

  async function fetchCategories() {
    try {
      const response = await api.get("/categories");
      SetCategories(response.data);
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

  async function fetchRecipesByCategory() {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/recipes/list/${user.id}/${categorySelected}`
      );
      setRecipes(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar as receitas.";

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
    fetchCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecipesByCategory();
    }, [categorySelected])
  );

  
  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ paddingX: 8 }}
        marginY={10}
        maxHeight={10}
        minHeight={10}
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Group
            name={item.description}
            isActive={categorySelected === item.id}
            onPress={() => setCategorySelected(item.id)}
          />
        )}
      />

      <VStack flex={1} paddingX={8}>
        <Heading color="gray.200" fontSize="lg" marginBottom={5}>
          Receitas
        </Heading>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 20 }}
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RecipeCard
                data={item}
                onPress={() => handleOpenRecipeDetails(item.id)}
              />
            )}
          />
        )}
      </VStack>
    </VStack>
  );
}
