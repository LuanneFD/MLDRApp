import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';

import { Home } from '@screens/Home';
import { Profile } from '@screens/Profile';
import { RecipeDetails } from '@screens/RecipeDetails';
import { CreateRecipe } from '@screens/CreateRecipe';

type AppRoutes = {
    home: undefined;
    profile: undefined;
    recipeDetails: undefined;
    createRecipe: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {

    const { sizes, colors } = useTheme();
    const iconSize = sizes[6];


    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.green[500],
            tabBarInactiveTintColor: colors.gray[200],
            tabBarStyle: {
                backgroundColor: colors.gray[600],
                borderTopWidth: 0,
                height: Platform.OS === 'android' ? 'auto' : 96,
                paddingBottom: sizes[8],
                paddingTop: sizes[6]
            }
        }}>
            <Screen name='home' component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <HomeSvg fill={color} width={iconSize} height={iconSize} />
                    )
                }}
            />
            <Screen name='createRecipe' component={CreateRecipe}
                options={{
                    tabBarIcon: ({ color }) => (
                        <HistorySvg fill={color} width={iconSize} height={iconSize} />
                    )
                }}
            />
            <Screen name='profile' component={Profile}
                options={{
                    tabBarIcon: ({ color }) => (
                        <ProfileSvg fill={color} width={iconSize} height={iconSize} />
                    )
                }}
            />
            <Screen name='recipeDetails' component={RecipeDetails} options={{ tabBarButton: () => null }} />
        </Navigator>
    );
}