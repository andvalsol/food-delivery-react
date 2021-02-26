import React, {useState} from "react"
import {Text, View, SafeAreaView, TouchableOpacity, StyleSheet, Image, FlatList} from "react-native"
import {COLORS, FONTS, icons, images, SIZES} from "../constants"
import {getCategoryData, getInitialLocation, getRestaurantData} from "../API/API"

const HomeScreen = (props) => {
    const [categories, setCategories] = useState[getCategoryData()] // TODO check how we can use this with an actual API call
    const [initialLocation, setInitialLocation] = useState[getInitialLocation()] // TODO check how we can use this with an actual API call
    const [restaurantData, setRestaurantData] = useState(getRestaurantData()) // TODO check how we can use this with an actual API call
    const [selectedCategory, setSelectedCategory] = useState(null)

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerOpacity}>
                    <Image
                        source={icons.nearby}
                        resizeMode="contain"
                        style={styles.topIcon}/>
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <View style={styles.searchBarBackground}/>
                    <Text>{initialLocation.streetName}</Text>
                </View>
                <TouchableOpacity style={styles.headerOpacity}>
                    <Image
                        source={icons.basket}
                        resizeMode="contain"
                        style={style.topIcon}/>
                </TouchableOpacity>
            </View>
        )
    }

    function onSelectCategory(category) {
        // Filter restaurant which contain the selected category
        let restaurantList = restaurantData.filter((restaurant) => restaurant.categories.includes(category))

        setRestaurantData(restaurantList)
        setSelectedCategory(category)
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity
                style={
                    [
                    ...styles.singleHorizontalCategory,
                    {backgroundColor: (selectedCategory?.id === item.id) ? COLORS.primary : COLORS.white}
                    ]
                }
                onPress={() => onSelectCategory(item)}>
                <View style={
                    [
                        ...styles.singleHorizontalBackground,
                        {backgroundColor: (selectedCategory?.id === item.id) ? COLORS.white : COLORS.lightGray}
                    ]
                }>
                    <Image
                        style={styles.singleHorizontalImage}
                        source={item.icon}
                        resizeMode="contain"/>
                </View>
                <Text style={
                    [
                        ...styles.singleHorizontalText,
                        {backgroundColor: (selectedCategory?.id === item.id) ? COLORS.white : COLORS.black}
                    ]
                }>
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }

    const renderMainCategories = () => {
        return (
            <View style={styles.categoryHeader}>
                <Text style={{...FONTS.h1}}>
                    Main
                </Text>
                <Text style={{...FONTS.h1}}>
                    Categories
                </Text>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.horizontalCategories}/>
            </View>
        )
    }

    return ( // SafeAreaView aligns items from top to bottom
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderMainCategories()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4

    },
    shadow: {
        shadowColor: "#000000", // For iOS
        shadowOffset: { // For iOS
            width: 3,
            height: 3
        },
        shadowOpacity: 0.1, // For iOS
        shadowRadius: 3, // For iOS
        elevation: 1 // For Android
    },
    header: {
        flowDirection: "row",
        height: 50
    },
    headerOpacity: {
        width: 50,
        paddingLeft: SIZES.padding * 2,
        justifyContent: "center"
    },
    topIcon: {
        width: 30,
        height: 30
    },
    searchBar: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    searchBarBackground: {
        width: "70%",
        height: "100%",
        backgroundColor: COLORS.lightGray3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: SIZES.radius
    },
    categoryHeader: {
        padding: SIZES.padding * 2
    },
    horizontalCategories: {
        paddingVertical: SIZES.padding * 2
    },
    singleHorizontalCategory: {
        padding: SIZES.padding,
        paddingBottom: SIZES.padding * 2,
        borderRadius: SIZES.radius,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SIZES.padding,
        ...styles.shadow
    },
    singleHorizontalBackground: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    },
    singleHorizontalImage: {
        width: 30,
        height: 30
    },
    singleHorizontalText: {
        marginTop: SIZES.padding,
        ...FONTS.body5
    }
})

export default HomeScreen