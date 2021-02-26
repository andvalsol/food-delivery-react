import React from 'react';
import {createStackNavigator} from "@react-navigation/stack" //  Navigation 5.0
import {NavigationContainer} from "@react-navigation/native" // Navigation 5.0
import OrderDeliveryScreen from "./screens/OrderDeliveryScreen"
import RestaurantScreen from "./screens/RestaurantScreen"
import Tabs from "./navigation/Tabs"

export const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName="HomeScreen">
                <Stack.Screen
                    name="HomeScreen"
                    component={Tabs}/>
                <Stack.Screen
                    name="RestaurantScreen"
                    component={RestaurantScreen}/>
                <Stack.Screen
                    name="OrderDeliveryScreen"
                    component={OrderDeliveryScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Create the stack for navigation
const Stack = createStackNavigator()