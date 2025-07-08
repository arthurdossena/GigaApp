import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../pages/login';
import BottomRoutes from './bottom.routes';
import Routine from '../pages/routine';
import SignUp from '../pages/signUp';
import { AuthProviderList } from '../context/authContext_list';

export default function Routes() {
    const Stack = createStackNavigator();
    
    return (
        <Stack.Navigator
            initialRouteName='Login'
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: '#fff'
                }
            }}
        >

            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
            <Stack.Screen name="Routine" component={Routine} />
            <Stack.Screen name="SignUp" component={SignUp} />

        </Stack.Navigator>
    );
}