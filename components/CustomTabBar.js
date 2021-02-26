import React from "react"
import {BottomTabBar} from "@react-navigation/bottom-tabs";
import {StyleSheet, View} from "react-native"

const CustomTabBar = (props) => {
    return (
        <View>
            <BottomTabBar{...props.props}/>
            <View style={styles.tabBar}/>
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        backgroundColor: "#FFFFFF"
    }
})

export default CustomTabBar