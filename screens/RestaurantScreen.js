import React, {useEffect, useState} from "react"
import {Animated, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import {COLORS, FONTS, icons, SIZES} from "../constants"


const RestaurantScreen = (props) => {
    const [restaurant, setRestaurant] = useState(null) // no selected restaurant at first
    const [currentLocation, setCurrentLocation] = useState(null)
    const [orderItems, setOrderItems] = useState([])

    const scrollX = new Animated.Value(0)

    useEffect(() => {
        const [item, initialLocation] = props.route.params

        setRestaurant(item) // We need to add these lines since if this screen is created previously, it will read the initial values and not the most recent ones
        setCurrentLocation(initialLocation)
    })

    const getOrderById = (menuId) => {
        const orderItems = orderItems.filter((item) => item.menuId === menuId)

        if (orderItems.length > 0) {
            return orderItems[0].qty
        }

        return 0
    }

    const sumOrder = () => {
        const total = orderItems.reduce((currentValue, item) => currentValue + (item.total), 0)

        return total.toFixed(2)
    }

    const getBasketItemCount = () => {
        let itemCount = orderItems.reduce((currentCount, item) => currentCount + (item.qty || 0), 0)

        return itemCount
    }

    const editOrder = (action, menuId, price) => {
        const items = orderItems.filter((item) => item.menuId === menuId)

        if (action === "+") {
            // Increase the order amount
            if (items.length > 0) {
                // The user has already added this item
                const item = items[0]
                item.qty = item.qty + 1
                item.total = item.price * item.qty
            } else {
                // It´s a new item that the user wants to add
                const item = {
                    menuId: menuId,
                    qty: 1,
                    price: price,
                    total: price // === to price * 1 since we only have 1 item
                }

                setOrderItems((orderItems) => orderItems.push(item))
            }
        } else if (action === "-") {
            // Decrease the order amount
            if (items.length > 0) {
                // Get the first item (there should only be 1 item)
                const item = items[0]
                if (item.qty > 0) {
                    item.qty = item.qty - 1
                    item.total = item.price * item.qty
                }
            }
        }
    }

    const renderHeader = (restaurant) => (
        <View
            style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.navigationIconContainer}
                onPress={() => {
                    props.navigation.goBack()
                }}>
                <Image
                    style={styles.navigationIcon}
                    source={icons.back}
                    resizeMode="contain"/>
            </TouchableOpacity>
            <View style={styles.restaurantNameSection}>
                <View
                    style={styles.restaurantNameBackgroundSection}>
                    <Text
                        style={styles.restaurantNameText}>
                        {restaurant.name}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.navigationIconContainer}
                onPress={() => {

                }}>
                <Image
                    style={styles.navigationIcon}
                    source={icons.list}
                    resizeMode="contain"/>
            </TouchableOpacity>
        </View>
    )

    const renderMenuItem = (item, index) => (
        <View
            style={styles.menuItemContainer}
            key={index}>
            <View style={styles.menuItem}>
                <Image
                    style={styles.menuItemImage}
                    source={item.photo}
                    resizeMode="cover"/>
                <View style={styles.menuItemQuantityContainer}>
                    <TouchableOpacity
                        onPress={editOrder("-", item.menuId, item.price)}
                        style={styles.menuItemQuantityLeftButtonBackground}>
                        <Text style={styles.menuItemQuantityText}>-</Text>
                    </TouchableOpacity>
                    <View style={styles.menuItemQuantityBackground}>
                        <Text style={styles.menuItemQuantityText}>{getOrderById(item.menuId)}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={editOrder("+", item.menuId, item.price)}
                        style={styles.menuItemQuantityRightButtonBackground}>
                        <Text style={styles.menuItemQuantityText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.menuItemDescriptionContainer}>
                <Text style={styles.menuItemDescriptionTitle}>
                    {item.name} - {item.price.toFixed(2)}
                </Text>
                <Text style={styles.menuItemDescription}>
                    {item.description}
                </Text>
                <View style={styles.menuItemCaloriesContainer}>
                    <Image
                        styles={styles.menuItemCaloriesImage}
                        source={icons.fire}/>
                    <Text
                        style={styles.menuItemCaloriesText}>
                        {item.calories.toFixed(2)} cal
                    </Text>
                </View>
            </View>
        </View>
    )

    const renderFoodInformation = () => (
        <Animated.ScrollView
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            snapToAlignment="center"
            showHorizontalScrollIndicator={false}
            onScroll={Animated.event(
                [{
                    nativeEvent: {
                        contentOffset: {
                            x: scrollX
                        }
                    }
                }], {
                    useNativeDriver: false
                }
            )}>
            {
                restaurant?.menu.map((item, index) => renderMenuItem(item, index))
            }
        </Animated.ScrollView>
    )

    const renderDots = () => {
        // Get the dot position
        const dotPosition = Animated.divide(scrollX, SIZES.width)

        return (
            <View style={styles.dotsContainer}>
                <View style={styles.dotsBackground}>
                    {restaurant?.menu.map((item, index) => {
                        const dotOpacity = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: "clamp"
                        })

                        const dotSize = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
                            extrapolate: "clamp"
                        })

                        const dotColor = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
                            extrapolate: "clamp"
                        })

                        return (
                            <Animated.View
                                key={index}
                                opacity={dotOpacity}
                                styles={
                                    [
                                        ...styles.dots,
                                        {
                                            backgroundColor: dotColor,
                                            width: dotSize,
                                            height: dotSize
                                        }
                                    ]
                                }/>
                        )
                    })}
                </View>
            </View>
        )
    }

    const renderOrderSection = () => (
        <View>
            {renderDots()}
            <View style={styles.orderSectionContainer}>
                <View style={styles.orderSectionHeader1}>
                    <Text style={styles.orderSectionHeaderText}>
                        {getBasketItemCount()} items in cart
                    </Text>
                    <Text style={styles.orderSectionHeaderText}>
                        {sumOrder()}
                    </Text>
                </View>
                <View style={styles.orderSectionHeader2}>
                    <View style={styles.orderSectionHeader2Background}>
                        <Image
                            resizeMode="contain"
                            source={icons.pin}
                            style={styles.orderSectionHeader2Image}/>
                        <Text style={styles.orderSectionHeader2Text}>
                            Location
                        </Text>
                    </View>
                    <View style={styles.orderSectionHeader2}>
                        <Image
                            source={icons.master_card}
                            resizeMode="contain"
                            style={styles.orderSectionHeader2Image}/>
                        <Text style={styles.orderSectionHeader2Text}>
                            8888
                        </Text>
                    </View>
                </View>
                <View style={styles.orderSectionButtonContainer}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("OrderDeliveryScreen", {
                            restaurant: restaurant,
                            currentLocation: currentLocation
                        })}
                        style={styles.orderSectionButton}>
                        <Text style={styles.orderSectionButtonText}>
                            Order
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

    return (
        <SafeAreaView
            style={styles.screenContainer}>
            {renderHeader(restaurant)}
            {renderFoodInformation()}
            {renderOrderSection()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: COLORS.lightGray2
    },
    headerContainer: {
        flexDirection: "row"
    },
    navigationIconContainer: {
        width: 50,
        paddingLeft: SIZES.padding * 2,
        justifyContent: "center"
    },
    navigationIcon: {
        width: 30,
        height: 30
    },
    restaurantNameSection: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    restaurantNameBackgroundSection: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.padding * 3,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.lightGray3
    },
    restaurantNameText: {
        ...FONTS.h3
    },
    menuItemContainer: {
        alignItems: "center"
    },
    menuItem: {
        height: SIZES.height * 0.35
    },
    menuItemImage: {
        width: SIZES.width,
        height: "100%"
    },
    menuItemQuantityContainer: {
        position: "absolute",
        bottom: -20,
        width: SIZES.width,
        height: 50,
        justifyContent: "center",
        flexDirection: "row"
    },
    menuItemQuantityLeftButtonBackground: {
        width: 50,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25
    },
    menuItemQuantityRightButtonBackground: {
        width: 50,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25
    },
    menuItemQuantityBackground: {
        width: 50,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    },
    menuItemQuantityText: {
        ...FONTS.body1
    },
    menuItemDescriptionContainer: {
        width: SIZES.width,
        alignItems: "center",
        marginTop: 15,
        paddingHorizontal: SIZES.padding * 2
    },
    menuItemDescriptionTitle: {
        marginVertical: 10,
        textAlign: "center",
        ...FONTS.h2
    },
    menuItemDescription: {
        ...FONTS.body3
    },
    menuItemCaloriesContainer: {
        flexDirection: "row",
        marginTop: 10
    },
    menuItemCaloriesImage: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    menuItemCaloriesText: {
        ...FONTS.body3,
        color: COLORS.darkgray
    },
    dotsContainer: {
        height: 30
    },
    dotsBackground: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: SIZES.padding
    },
    dots: {
        borderRadius: SIZES.borderRadius,
        marginHorizontal: 6
    },
    orderSectionContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    orderSectionHeader1: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: SIZES.padding * 2,
        paddingHorizontal: SIZES.padding * 3,
        borderBottomColor: COLORS.lightGray2,
        borderBottomWidth: 1
    },
    orderSectionHeaderText: {
        ...FONTS.h3
    },
    orderSectionHeader2: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: SIZES.padding * 2,
        paddingHorizontal: SIZES.padding * 3
    },
    orderSectionHeader2Background: {
        flexDirection: "row"
    },
    orderSectionHeader2Image: {
        width: 20,
        height: 20,
        tintColor: COLORS.darkgray
    },
    orderSectionHeader2Text: {
        marginLeft: SIZES.padding,
        ...FONTS.h4
    },
    orderSectionButtonContainer: {
        padding: SIZES.padding * 2,
        alignItems: "center",
        justifyContent: "center"
    },
    orderSectionButton: {
        width: SIZES.width * 0.9,
        padding: SIZES.padding,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        borderRadius: SIZES.radius
    },
    orderSectionButtonText: {
        color: COLORS.white,
        ...FONTS.h2
    },
    emptySpaceFill: { // For devices like iPhoneX

    }
})

export default RestaurantScreen