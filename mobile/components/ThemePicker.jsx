import React, { useRef, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEMES } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

const { height } = Dimensions.get("window");

const THEME_LABELS = {
    coffee: { label: "Coffee", emoji: "☕" },
    forest: { label: "Forest", emoji: "🌿" },
    purple: { label: "Purple", emoji: "🔮" },
    ocean: { label: "Ocean", emoji: "🌊" },
    sunset: { label: "Sunset", emoji: "🌅" },
    mint: { label: "Mint", emoji: "🍃" },
    midnight: { label: "Midnight", emoji: "🌙" },
    roseGold: { label: "Rose Gold", emoji: "🌸" },
};

const ThemePicker = ({ visible, onClose }) => {
    const { themeName, colors, setTheme } = useTheme();
    const slideAnim = useRef(new Animated.Value(height)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 200,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: height,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 220,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleSelect = (name) => {
        setTheme(name);
        setTimeout(onClose, 180);
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            {/* Backdrop */}
            <Animated.View
                style={[styles.backdrop, { opacity: backdropAnim }]}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            {/* Sheet */}
            <Animated.View
                style={[
                    styles.sheet,
                    { backgroundColor: colors.white, transform: [{ translateY: slideAnim }] },
                ]}
            >
                {/* Handle */}
                <View style={styles.handleRow}>
                    <View style={[styles.handle, { backgroundColor: colors.border }]} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>Choose Theme</Text>
                        <Text style={[styles.subtitle, { color: colors.textLight }]}>
                            Pick a color palette that suits you
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.closeBtn, { backgroundColor: colors.background }]}
                    >
                        <Ionicons name="close" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Theme Grid */}
                <View style={styles.grid}>
                    {Object.entries(THEMES).map(([name, theme]) => {
                        const isActive = name === themeName;
                        const meta = THEME_LABELS[name];
                        return (
                            <ThemeCard
                                key={name}
                                name={name}
                                theme={theme}
                                meta={meta}
                                isActive={isActive}
                                onPress={() => handleSelect(name)}
                            />
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textLight }]}>
                        Theme is saved automatically ✨
                    </Text>
                </View>
            </Animated.View>
        </Modal>
    );
};

const ThemeCard = ({ name, theme, meta, isActive, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.93, duration: 80, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: "48%" }}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePress}
                style={[
                    styles.themeCard,
                    {
                        backgroundColor: theme.background,
                        borderColor: isActive ? theme.primary : theme.border,
                        borderWidth: isActive ? 2.5 : 1.5,
                    },
                ]}
            >
                {/* Color swatches row */}
                <View style={styles.swatchRow}>
                    <View style={[styles.swatch, { backgroundColor: theme.primary }]} />
                    <View style={[styles.swatchSm, { backgroundColor: theme.textLight }]} />
                    <View style={[styles.swatchSm, { backgroundColor: theme.border }]} />
                </View>

                {/* Label row */}
                <View style={styles.cardLabelRow}>
                    <Text style={styles.cardEmoji}>{meta.emoji}</Text>
                    <Text style={[styles.cardLabel, { color: theme.text }]}>{meta.label}</Text>
                    {isActive && (
                        <View style={[styles.activeBadge, { backgroundColor: theme.primary }]}>
                            <Ionicons name="checkmark" size={10} color="#fff" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    sheet: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: 36,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 20,
    },
    handleRow: {
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 4,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: 13,
        marginTop: 4,
        fontWeight: "500",
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
        gap: 12,
        justifyContent: "space-between",
    },
    themeCard: {
        borderRadius: 18,
        padding: 14,
        gap: 10,
    },
    swatchRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    swatch: {
        width: 28,
        height: 28,
        borderRadius: 8,
    },
    swatchSm: {
        width: 20,
        height: 20,
        borderRadius: 6,
    },
    cardLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    cardEmoji: {
        fontSize: 14,
    },
    cardLabel: {
        fontSize: 13,
        fontWeight: "700",
        flex: 1,
    },
    activeBadge: {
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    footer: {
        alignItems: "center",
        paddingTop: 20,
        paddingHorizontal: 24,
    },
    footerText: {
        fontSize: 12,
        fontWeight: "500",
    },
});

export default ThemePicker;
