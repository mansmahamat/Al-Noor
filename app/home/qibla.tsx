import React, {
    useState,
    useEffect,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from "react"
import PropTypes from "prop-types"
import { Image, View, StyleSheet, ActivityIndicator } from "react-native"
import { Magnetometer } from "expo-sensors"
import * as Location from "expo-location"
import { moderateScale } from "react-native-size-matters"
import { Text } from "tamagui"
import { I18n } from "i18n-js";
import fr from "../../locales/french/fr.json";
import en from "../../locales/english/en.json";
import ar from "../../locales/arabic/ar.json";
import useLanguageStore from "../store/languagesStore"

export const useQiblaCompass = () => {
    const [subscription, setSubscription] = useState(null)
    const [magnetometer, setMagnetometer] = useState(0)
    const [qiblad, setQiblad] = useState(0)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)


    const initCompass = useCallback(async () => {
        const isAvailable = await Magnetometer.isAvailableAsync()
        if (!isAvailable) {
            setError("Compass is not available on this device")
            setIsLoading(false)
            return
        }
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
            setError("Location permission not granted")
            setIsLoading(false)
            return
        }

        try {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                setError("Location permission denied.")
                return
            }

            let location = await Location.getCurrentPositionAsync({})
            //  let location = await Location.getCurrentPositionAsync({});
            const latitude = 59.3293
            const longitude = 18.0686
            // const { latitude, longitude } = location.coords;
            calculate(location.coords.latitude,
                location.coords.longitude)
        } finally {
            setIsLoading(false)
            subscribe()
        }
    }, [])

    useEffect(() => {
        initCompass()

        return () => {
            unsubscribe()
        }
    }, [])

    const subscribe = () => {
        Magnetometer.setUpdateInterval(400)
        setSubscription(
            Magnetometer.addListener((data) => {
                setMagnetometer(angle(data))
            })
        )
    }

    const unsubscribe = () => {
        subscription && subscription.remove()
        setSubscription(null)
    }

    const angle = (magnetometer) => {
        let angle = 0
        if (magnetometer) {
            let { x, y, z } = magnetometer
            if (Math.atan2(y, x) >= 0) {
                angle = Math.atan2(y, x) * (180 / Math.PI)
            } else {
                angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI)
            }
        }
        return Math.round(angle)
    }

    const direction = (degree) => {
        if (degree >= 22.5 && degree < 67.5) {
            return "NE"
        } else if (degree >= 67.5 && degree < 112.5) {
            return "E"
        } else if (degree >= 112.5 && degree < 157.5) {
            return "SE"
        } else if (degree >= 157.5 && degree < 202.5) {
            return "S"
        } else if (degree >= 202.5 && degree < 247.5) {
            return "SW"
        } else if (degree >= 247.5 && degree < 292.5) {
            return "W"
        } else if (degree >= 292.5 && degree < 337.5) {
            return "NW"
        } else {
            return "N"
        }
    }

    const degree = (magnetometer) => {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271
    }

    const calculate = (latitude, longitude) => {
        const PI = Math.PI
        let latk = (21.4225 * PI) / 180.0
        let longk = (39.8264 * PI) / 180.0
        let phi = (latitude * PI) / 180.0
        let lambda = (longitude * PI) / 180.0
        let qiblad =
            (180.0 / PI) *
            Math.atan2(
                Math.sin(longk - lambda),
                Math.cos(phi) * Math.tan(latk) -
                Math.sin(phi) * Math.cos(longk - lambda)
            )
        setQiblad(qiblad)
    }

    const compassDirection = direction(degree(magnetometer))
    const compassDegree = degree(magnetometer)
    const compassRotate = 360 - degree(magnetometer)
    const kabaRotate = 360 - degree(magnetometer) + qiblad

    return {
        qiblad,
        compassDirection,
        compassDegree,
        compassRotate,
        kabaRotate,
        error,
        isLoading,
        reinitCompass: initCompass,
    }
}

const QiblaCompass = forwardRef(
    (
        //@ts-ignore
        { backgroundColor = "", color = "", textStyles = {
        } },
        ref
    ) => {
        const {
            qiblad,
            compassDirection,
            compassDegree,
            compassRotate,
            kabaRotate,
            error,
            isLoading,
            reinitCompass,
        } = useQiblaCompass()

        useImperativeHandle(
            ref,
            () => {
                return {
                    reinitCompass,
                }
            },
            []
        )

        if (isLoading) {
            return (
                <View style={[styles.container, { backgroundColor }]}>
                    <ActivityIndicator size={50} color={color} />
                </View>
            )
        }





        return (
            <View style={[styles.container, { backgroundColor }]}>
                {error && (
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            textAlign: "center",
                            paddingHorizontal: 20,
                            fontSize: moderateScale(16, 0.25),
                            ...textStyles,
                        }}
                    >
                        Error: {error}
                    </Text>
                )}
                <View style={styles.direction}>
                    <Text fontSize="$9" color="$green8">Qibla
                    </Text>
                    {/* <Text >
                        {compassDirection}
                    </Text> */}
                    <Text
                        textAlign="center"
                        fontSize="$9" color="$green8"
                    // style={[styles.directionText, { color, ...textStyles }]}
                    >
                        {compassDegree}°
                    </Text>
                </View>
                <View
                    style={{
                        width: "200%",
                        marginTop: 100,
                        height: moderateScale(300, 0.25),
                        position: "relative",
                        justifyContent: "center",
                        alignItems: "center"

                    }}
                >
                    <Image
                        source={require("../../assets/compass_bg.png")}
                        style={[
                            styles.image,
                            {
                                transform: [
                                    {
                                        rotate: compassRotate + "deg",
                                    },
                                ],
                            },
                        ]}
                    />
                    <View
                        style={{
                            width: moderateScale(500, 0.25),
                            height: moderateScale(500, 0.25),
                            position: "absolute",
                            alignSelf: "center",
                            transform: [
                                {
                                    rotate: `${kabaRotate}deg`,
                                },
                            ],
                            flexDirection: "row",
                            justifyContent: "center",
                            zIndex: 999,
                        }}
                    >
                        <Image
                            source={require("../../assets/compass_pointer.png")}
                            style={{
                                resizeMode: "contain",
                                height: 30,
                                paddingBottom: 150,
                                marginTop: 20,
                                width: 30,
                                zIndex: 999,
                            }}
                        />
                    </View>
                </View>
                <View style={styles.qiblaDirection}>
                    {/* <Image
                        source={require("../../assets/kaaba.png")}
                        style={{
                            width: moderateScale(35, 0.25),
                            height: moderateScale(35, 0.25),
                        }}
                    /> */}
                    <Text
                        fontSize="$9" color="$green8"
                    >
                        {qiblad.toFixed(0)}°
                    </Text>
                    <Text
                        textAlign="center"

                        fontSize="$9" color="$green8"
                    //   style={[styles.directionText, { color, ...textStyles }]}
                    >
                        {qiblad.toFixed(0) == compassDegree && "Qibla "}
                    </Text>
                </View>
            </View>
        )
    }
)



const styles = StyleSheet.create({
    image: {
        resizeMode: "contain",
        alignSelf: "center",
        position: "absolute",
        top: 0,
        width: moderateScale(300, 0.25),
        height: moderateScale(300, 0.25),
    },
    container: {
        backgroundColor: "#f00",  // Background color of the container
        justifyContent: "center",  // Aligns content vertically in the center
        alignItems: "center",  // Aligns content horizontally in the center
        position: "relative",
        height: "100%",
    },
    direction: {
        textAlign: "center",
        zIndex: 300,
        color: "#4c6c53 !important",
    },
    directionText: {
        textAlign: "center",
        fontSize: 30,

    },
    qiblaDirection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
})

export default QiblaCompass
