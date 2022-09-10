import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { useColorMode, useTheme, StatusBar } from 'native-base';
import ModalScreen from '../screens/ModalScreen';
import ModalScreenEditProfile from '../screens/ModalScreenEditProfile';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation() {
  const { colorMode } = useColorMode();
  const { colors } = useTheme();

  const lightNav = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.blueGray[50],
      border: colors.blueGray[400],
      card: colors.blueGray[50],
    },
  };

  const darkNav = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.dark[100],
      border: colors.dark[300],
      card: colors.dark[100],
    },
  };

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorMode === 'dark' ? darkNav : lightNav}
    >
      <StatusBar
        barStyle={colorMode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { colorMode } = useColorMode();
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colorMode === 'dark' ? 'white' : 'black',
      }}
    >
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
        <Stack.Screen
          name="ModalEditProfile"
          component={ModalScreenEditProfile}
          options={{
            title: 'Edit Profile',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const { colorMode } = useColorMode();
  const { colors } = useTheme();
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor:
          colorMode === 'dark' ? colors.white : colors.dark[100],
        tabBarInactiveTintColor:
          colorMode === 'dark' ? colors.dark[400] : colors.dark[500],
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={colorMode === 'dark' ? colors.white : colors.dark[100]}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
