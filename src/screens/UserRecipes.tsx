import { Loading } from "@components/Loading";
import { RecipeCard } from "@components/RecipeCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { RecipeDTO } from "@dtos/RecipeDTO";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { FlatList, VStack,useToast,Text, Center } from "native-base";
import { useCallback, useEffect, useState } from "react";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";

export function UserRecipes() {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();
  const toast = useToast();

  function handleOpenRecipeDetails(recipeId: string) {
    navigation.navigate("recipeDetails", { recipeId });
  }

    async function fetchUserRecipes() {

    try {
      setIsLoading(true);
      const response = await api.get( `/recipes/filteruser/${user.id}`);
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

    useFocusEffect(useCallback(() => {
    fetchUserRecipes();
  }, []));
  
  return (
    <VStack flex={1}>
      <ScreenHeader title="Minhas Receitas" />

      {isLoading ? 
          (
            <Loading />
          ) :
          (
              <FlatList
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ paddingBottom: 20 }}
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <RecipeCard
                    data={item}
                    onPress={() => handleOpenRecipeDetails(item.id)}
                    edit={true}
                  />
                )}
                contentContainerStyle={recipes.length === 0 && {flex:1, justifyContent: 'center'}}
                ListEmptyComponent={() => (
                  <Text color={"gray.100"} textAlign={"center"}>Não há receitas registradas ainda.</Text>
                )}
              />
          )
      }
    </VStack>
  );
}
