import React, {useState, useEffect, useRef} from "react"
import {View, Image, TouchableOpacity, Text, StyleSheet} from "react-native"
import MapView, {PROVIDER_GOOGLE, Marker} from "react-native-maps"
import {COLORS, GOOGLE_API_KEY, icons, SIZES, FONTS} from "../constants"
import MapViewDirections from "react-native-maps-directions"

const OrderDeliveryScreen = (props) => {

    const mapView = useRef()

    const [restaurant, setRestaurant] = useState(null)
    const [streetName, setStreetName] = useState("")
    const [fromLocation, setFromLocation] = useState(null)
    const [toLocation, setToLocation] = useState(null)
    const [region, setRegion] = useState(null)
    const [duration, setDuration] = useState(0)
    const [isReady, setIsReady] = useState(false)
    const [angle, setAngle] = useState(0)

    useEffect(() => {
        const {restaurant, currentLocation} = props.route.params

        const fromLocation = currentLocation.gps
        const toLocation = restaurant.location
        const street = currentLocation.streetName

        const mapRegion = {
            latitude: (fromLocation.latitude + toLocation.latitude) / 2,
            longitude: (fromLocation.longitude + toLocation.longitude) / 2,
            latitudeDelta: Math.abs(fromLocation.latitude - toLocation.latitude) * 2,
            longitudeDelta: Math.abs(fromLocation.longitude - toLocation.longitude) * 2
        }

        setRestaurant(restaurant)
        setStreetName(street)
        setFromLocation(fromLocation)
        setToLocation(toLocation)
        setRegion(mapRegion)
    }, [])

    const destinationMarker = () => (
        <Marker
            coordinate={toLocation}>
            <View style={styles.markerContainer}>
                <View style={styles.markerInnerContainer}>
                    <Image
                        source={icons.pin}
                        style={styles.pinIcon}/>
                </View>
            </View>
        </Marker>
    )

    const carIcon = () => (
        <Marker
            rotation={angle}
            coordinate={fromLocation}
            anchor={{
                x: 0.5,
                y: 0.5,
            }}
            flat: true>
            <Image
                source={icons.car}
                style={styles.carIcon}/>
        </Marker>
    )

    const calculateAngle = (coordinates) => {
        const startLatitude = coordinates[0]["latitude"]
        const startLongitude = coordinates[0]["longitude"]
        const endLatitude = coordinates[1]["latitude"]
        const endLongitude = coordinates[1]["longitude"]

        const dx = endLatitude - startLatitude
        const dy = endLongitude - startLongitude

        return Math.atan2(dy, dx) * 180 / Math.PI
    }

    const renderMap = () => (
        <View style={styles.container}>
            <MapView
                ref={mapView}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                style={styles.mapContainer}>
                <MapViewDirections
                    origin={fromLocation}
                    destination={toLocation}
                    apikey={GOOGLE_API_KEY}
                    strokeWidth={5}
                    strokeColor={COLORS.primary}
                    optimizeWaypoints={true}
                    onReady={(result) => {
                        setDuration(result.duration)

                        if (!isReady) {
                            // Fit route into coordinates
                            mapView.current.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    right: SIZES.width / 20,
                                    bottom: SIZES.height / 4,
                                    left: SIZES.width / 20,
                                    top: SIZES.height / 8
                                }
                            })

                            // Re position the car
                            const nextLocation = {
                                latitude: result.coordinate[0]["latitude"],
                                longitude: result.coordinates[0]["longitude"]
                            }

                            if (result.coordinates.length >= 2) {
                                const angle = calculateAngle(result.coordinates)
                                setAngle(angle)
                            }

                            setFromLocation(nextLocation)
                            setIsReady(true)
                        }
                    }}/>
                {destinationMarker()}
                {carIcon()}
            </MapView>
        </View>
    )

    const renderDestinationHeader = () => (
        <View style={styles.destinationHeaderContainer}>
            <View style={styles.destinationHeader}>
                <Image
                    source={icons.red_pin}
                    style={styles.destinationHeaderLeftImage}/>
                <View style={styles.destinationHeaderTextContainer}>
                    <Text
                        style={styles.destinationHeaderText}>
                        {streetName}
                    </Text>
                </View>
                <Text style={styles.destinationHeaderText}>
                    {Math.ceil(duration)} mins
                </Text>
            </View>
        </View>
    )

    const renderDeliveryInfo = () => (
        <View style={styles.deliveryInformationContainer}>
            <View style={styles.deliveryInformation}>
                <View style={styles.deliveryInformationContent}>
                    <Image
                        style={styles.deliveryInformationAvatar}
                        source={restaurant?.courier.avatar}/>
                    <View
                        style={styles.deliveryInformationHorizontalContainer}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text style={{...FONTS.h4}}>
                                {restaurant?.courier.name}
                            </Text>
                            <View
                                style={{flexDirection: "row"}}>
                                <Image
                                    style={{
                                        width: 18,
                                        height: 18,
                                        tintColor: COLORS.primary,
                                        marginRight: SIZES.padding
                                    }}
                                    source={icons.star}/>
                                <Text
                                    style={{...FONTS.body3}}>
                                    {restaurant.rating}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={{
                                color: COLORS.darkgray,
                                ...FONTS.body4
                            }}>
                            {restaurant?.name}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: SIZES.padding * 2,
                        justifyContent: "space-between"
                    }}>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: SIZES.width * 0.5 - SIZES.padding * 6,
                            backgroundColor: COLORS.primary,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10
                        }}>
                        <Text
                            style={{
                                ...FONTS.h4,
                                color: "#FFFFFF"
                            }}>
                            Call
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: SIZES.width * 0.5 - SIZES.padding * 6,
                            backgroundColor: COLORS.secondary,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10
                        }}>
                        <Text
                            style={{
                                ...FONTS.h4,
                                color: "#FFFFFF"
                            }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            {renderMap()}
            {renderDestinationHeader()}
            {renderDeliveryInfo()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapContainer: {
        flex: 1
    },
    markerContainer: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF"
    },
    markerInnerContainer: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary
    },
    pinIcon: {
        width: 25,
        height: 25,
        tintColor: "#FFFFFF"
    },
    carIcon: {
        width: 40,
        height: 40
    },
    destinationHeaderContainer: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    destinationHeader: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width * 0.9,
        paddingVertical: SIZES.padding,
        paddingHorizontal: SIZES.padding * 2,
        borderRadius: SIZES.radius,
        backgroundColor: "#FFFFFF"
    },
    destinationHeaderLeftImage: {
        width: 30,
        height: 30,
        marginRight: SIZES.padding
    },
    destinationHeaderTextContainer: {
        flex: 1
    },
    destinationHeaderText: {
        ...FONTS.body3
    },
    deliveryInformationContainer: { // TODO can we merge this style with the deliveryInformation, deliveryInformationContent styles?
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    deliveryInformation: {
        width: SIZES.width * 0.9,
        paddingVertical: SIZES.padding * 3,
        paddingHorizontal: SIZES.padding * 2,
        borderRadius: SIZES.radius,
        backgroundColor: "#FFFFFF"
    },
    deliveryInformationContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    deliveryInformationAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    deliveryInformationHorizontalContainer: {
        flex: 1,
        marginLeft: SIZES.padding
    }
})

export default OrderDeliveryScreen