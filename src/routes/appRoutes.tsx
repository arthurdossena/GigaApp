import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BottomRoutes from './bottom.routes';
import Routine from '../pages/routine';
import { AuthProviderList } from '../context/authContext_list';

const Stack = createStackNavigator();

export default function AppRoutes({ route }: any) {
  const { email } = route.params || {};

  return (
    // O AuthProviderList envolve todas as telas que precisam do contexto
    <AuthProviderList initialEmail={email}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
        <Stack.Screen name="Routine" component={Routine} />
      </Stack.Navigator>
    </AuthProviderList>
  );
}