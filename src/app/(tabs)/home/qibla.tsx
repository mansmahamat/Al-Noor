import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useMemo } from "react"
import { Image, View, StyleSheet, ActivityIndicator } from "react-native"
import { Magnetometer } from "expo-sensors"
import * as Location from "expo-location"
import { moderateScale } from "react-native-size-matters"
import { Text } from "tamagui"

interface QiblaCompassProps {
    backgroundColor?: string;
    color?: string;
}

interface QiblaCompassRef {
    reinitCompass: () => void;
}

const QiblaCompass = forwardRef<QiblaCompassRef, QiblaCompassProps>(({ backgroundColor = "#4c6c53", color = "" }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [magnetometer, setMagnetometer] = useState(0);
    const [qiblad, setQiblad] = useState(0);

    const initCompass = useCallback(async () => {
        const isAvailable = await Magnetometer.isAvailableAsync();
        if (!isAvailable) {
            setError("Compass is not available on this device");
            setIsLoading(false);
            return;
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setError("Location permission not granted");
            setIsLoading(false);
            return;
        }
        try {
            const latitude = 59.3293;
            const longitude = 18.0686;
            calculate(latitude, longitude);
        } finally {
            setIsLoading(false);
            subscribe();
        }
    }, []);

    useEffect(() => {
        initCompass();
        return unsubscribe;
    }, []);

    const subscribe = () => {
        Magnetometer.setUpdateInterval(100);
        const subscription = Magnetometer.addListener((data) => {
            setMagnetometer(angle(data));
        });
        return () => subscription.remove();
    };

    const unsubscribe = () => {
        Magnetometer.removeAllListeners();
    };

    const angle = (magnetometer) => {
        let angle = 0;
        if (magnetometer) {
            let { x, y } = magnetometer;
            angle = (Math.atan2(y, x) * 180) / Math.PI;
            angle = angle >= 0 ? angle : angle + 360;
        }
        return Math.round(angle);
    };

    const calculate = (latitude, longitude) => {
        const PI = Math.PI;
        let latk = (21.4225 * PI) / 180.0;
        let longk = (39.8264 * PI) / 180.0;
        let phi = (latitude * PI) / 180.0;
        let lambda = (longitude * PI) / 180.0;
        let qiblad =
            (180.0 / PI) *
            Math.atan2(
                Math.sin(longk - lambda),
                Math.cos(phi) * Math.tan(latk) - Math.sin(phi) * Math.cos(longk - lambda)
            );
        setQiblad(qiblad);
    };

    const direction = (degree) => {
        if (degree >= 22.5 && degree < 67.5) {
            return "NE";
        } else if (degree >= 67.5 && degree < 112.5) {
            return "E";
        } else if (degree >= 112.5 && degree < 157.5) {
            return "SE";
        } else if (degree >= 157.5 && degree < 202.5) {
            return "S";
        } else if (degree >= 202.5 && degree < 247.5) {
            return "SW";
        } else if (degree >= 247.5 && degree < 292.5) {
            return "W";
        } else if (degree >= 292.5 && degree < 337.5) {
            return "NW";
        } else {
            return "N";
        }
    };

    const compassDirection = useMemo(() => direction(magnetometer), [magnetometer]);
    const compassDegree = useMemo(() => magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271, [magnetometer]);
    const compassRotate = useMemo(() => 360 - magnetometer, [magnetometer]);
    const kabaRotate = useMemo(() => 360 - magnetometer + qiblad, [magnetometer, qiblad]);

    const reinitCompass = useCallback(() => {
        setIsLoading(true);
        initCompass();
    }, [initCompass]);

    useImperativeHandle(ref, () => ({ reinitCompass }), [reinitCompass]);

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor }]}>
                <ActivityIndicator size={50} color={color} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {error && (
                <Text style={[styles.errorText]}>
                    Error: {error}
                </Text>
            )}
            <View style={styles.direction}>
                <Text style={styles.directionText}>{compassDegree}°</Text>
            </View>
            <View style={styles.compassContainer}>
                <Image
                    source={require("../../../assets/compass_bg.png")}
                    style={[styles.image, { transform: [{ rotate: compassRotate + "deg" }] }]}
                />
                <View style={styles.pointerContainer}>
                    <Image
                        source={require("../../../assets/compass_pointer.png")}
                        style={styles.pointer}
                    />
                </View>
            </View>
            <View style={styles.qiblaDirection}>
                <Text textAlign="center"

                    fontSize="$9" color="$green8" style={styles.directionText}>{qiblad.toFixed(0)}°</Text>
                <Text
                    textAlign="center"

                    fontSize="$9" color="$green8"
                >
                    {qiblad.toFixed(0) === compassDegree.toString() && "Qibla "}
                </Text>
            </View>
        </View>
    );
}
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontWeight: "bold",
        paddingHorizontal: 20,
        fontSize: moderateScale(16, 0.25),
    },
    direction: {
        marginBottom: 20,
    },
    directionText: {
        fontSize: moderateScale(20, 0.25),
    },
    compassContainer: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        resizeMode: "contain",
        width: moderateScale(300, 0.25),
        height: moderateScale(300, 0.25),
    },
    pointerContainer: {
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    pointer: {
        resizeMode: "contain",
        width: 30,
        height: 30,
    },
    qiblaDirection: {
        marginTop: 20,
    },
});

export default QiblaCompass;
