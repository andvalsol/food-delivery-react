import React from "react"
import {Image, StyleSheet} from "react-native"
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import HomeScreen from "../screens/HomeScreen"
import {COLORS, icons} from "../constants"
import CustomTabBar from "../components/CustomTabBar"
import CustomTabBarButton from "../components/CustomTabBarButton";

const Tab = createBottomTabNavigator()

const Tabs = () => {
    return (
        <Tab.Navigator
            tabBar={
                (props) => (
                    <CustomTabBar
                        props={props}/>
                )
            }
            tabBarOptions={{
                showLabel: false,
                style: styles.tabBar
            }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarIcon: (focused) => (
                        <Image
                            style={[styles.tabs, focused ? COLORS.primary : COLORS.secondary]}
                            source={icons.cutlery}
                            resizeMode="contain"/>
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton
                            {...props}/>
                    )
                }}/>
            <Tab.Screen
                name="Search"
                component={HomeScreen}
                options={{
                    tabBarIcon: (focused) => (
                        <Image
                            style={[styles.tabs, focused ? COLORS.primary : COLORS.secondary]}
                            source={icons.search}
                            resizeMode="contain"/>
                    )
                }}/>
            <Tab.Screen
                name="Like"
                component={HomeScreen}
                options={{
                    tabBarIcon: (focused) => (
                        <Image
                            style={[styles.tabs, focused ? COLORS.primary : COLORS.secondary]}
                            source={icons.like}
                            resizeMode="contain"/>
                    )
                }}/>
            <Tab.Screen
                name="User"
                component={HomeScreen}
                options={{
                    tabBarIcon: (focused) => (
                        <Image
                            style={[styles.tabs, focused ? COLORS.primary : COLORS.secondary]}
                            source={icons.user}
                            resizeMode="contain"/>
                    )
                }}/>
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabs: {
        width: 25,
        height: 25
    },
    tabBar: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        elevation: 0 // For Android
    }
})

export default Tabs