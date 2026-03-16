import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const AppSplashScreen = ({ onFinish }) => {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        // Hide this splash screen after 2.5 seconds
        const timer = setTimeout(() => {
            if (onFinish) {
                onFinish();
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/splash_background.png')}
                style={styles.backgroundImage}
                contentFit="cover"
            >
                {/* Center Content */}
                <View style={styles.contentContainer}>
                    <Image
                        source={require('../assets/images/splash_icon.png')}
                        style={styles.icon}
                        contentFit="contain"
                    />
                    <Text style={styles.title}>Quick Bite</Text>
                </View>

                {/* Bottom Footer Text */}
                <View style={[styles.footerContainer, { paddingBottom: insets.bottom + 40 }]}>
                    <Text style={styles.footerText}>Your next meal, delivered fast.</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9', // Fallback color mirroring the image vibe
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 80, // slight offset to balance the bottom text visually
    },
    icon: {
        width: 300,
        height: 300,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#498144', // Dark green color matching the design
        letterSpacing: 0.5,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#5E6B5A', // Grayish green
        letterSpacing: 0.2,
    },
});

export default AppSplashScreen;
