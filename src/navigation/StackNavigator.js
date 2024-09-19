import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RegistroScreen from '../screens/RegistroScreen';
import ListaCorposScreen from '../screens/ListaCorposScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Funerária' }} />
      <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: 'Registrar Corpo' }} />
      <Stack.Screen name="ListaCorpos" component={ListaCorposScreen} options={{ title: 'Corpos Recebidos' }} />
    </Stack.Navigator>
  );
}
