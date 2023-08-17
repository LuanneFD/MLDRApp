import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import { useTheme, Icon } from "native-base";
import { Platform } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

import HomeSvg from "@assets/home.svg";
import ProfileSvg from "@assets/profile.svg";

import { Home } from "@screens/Home";
import { Profile } from "@screens/Profile";
import { RecipeDetails } from "@screens/RecipeDetails";
import { CreateRecipe } from "@screens/CreateRecipe";
import { UserRecipes } from "@screens/UserRecipes";

type AppRoutes = {
  home: undefined;
  profile: undefined;
  recipeDetails: { recipeId: string };
  createRecipe: undefined;
  userRecipes: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { sizes, colors } = useTheme();
  const iconSize = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: sizes[8],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="createRecipe"
        component={CreateRecipe}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              as={Ionicons}
              name="ios-add-circle-outline"
              color={color}
              size={7}
            />
          ),
        }}
      />
      <Screen
        name="userRecipes"
        component={UserRecipes}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={Feather} name="user-check" color={color} size={6} />
          ),
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
      <Screen
        name="recipeDetails"
        component={RecipeDetails}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
