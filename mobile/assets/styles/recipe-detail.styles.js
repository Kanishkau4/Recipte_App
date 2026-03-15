import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const makeRecipeDetailStyles = (COLORS) => StyleSheet.create({

    // ── Layout ──────────────────────────────────────────
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        gap: 12,
        padding: 32,
    },

    // ── Loading / Error states ───────────────────────────
    loadingText: {
        fontSize: 15,
        color: COLORS.textLight,
        marginTop: 8,
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: COLORS.text,
        marginTop: 12,
    },
    backBtn: {
        marginTop: 16,
        paddingHorizontal: 28,
        paddingVertical: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 30,
    },
    backBtnText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 15,
    },

    // ── Hero ─────────────────────────────────────────────
    heroContainer: {
        width: width,
        height: height * 0.52,
        position: "relative",
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    heroGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "70%",
    },

    // ── Floating header buttons ──────────────────────────
    headerButtons: {
        position: "absolute",
        top: 28,
        left: 16,
        right: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerRight: {
        flexDirection: "row",
        gap: 10,
    },
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    iconButtonActive: {
        backgroundColor: "rgba(224,64,94,0.35)",
        borderColor: "rgba(255,107,138,0.4)",
    },

    // ── Hero text overlay ────────────────────────────────
    heroTextContainer: {
        position: "absolute",
        bottom: 52,
        left: 20,
        right: 20,
    },
    categoryBadge: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 10,
    },
    categoryBadgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: "800",
        color: "#fff",
        lineHeight: 34,
        marginBottom: 12,
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    metaText: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 13,
        fontWeight: "600",
    },
    metaSep: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.4)",
    },

    // ── Content Card ─────────────────────────────────────
    contentCard: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -28,
        paddingTop: 28,
        paddingHorizontal: 20,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 10,
    },

    // ── Section layout ───────────────────────────────────
    section: {
        marginBottom: 4,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 18,
    },
    sectionIconBox: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: COLORS.text,
        flex: 1,
    },
    countPill: {
        backgroundColor: COLORS.primary + "22",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    countPillText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: "700",
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 24,
    },

    // ── Ingredients ──────────────────────────────────────
    ingredientsGrid: {
        gap: 10,
    },
    ingredientChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    ingredientDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    ingredientText: {
        fontSize: 15,
        color: COLORS.text,
        flex: 1,
        fontWeight: "500",
    },

    // ── Steps ────────────────────────────────────────────
    stepsList: {
        gap: 14,
    },
    stepLabel: {
        fontSize: 13,
        fontWeight: "800",
        color: COLORS.primary,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    stepCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    stepText: {
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 23,
    },

    // ── YouTube section ──────────────────────────────────
    youtubeCard: {
        borderRadius: 20,
        overflow: "hidden",
        height: 220,
        backgroundColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 8,
    },
    webview: {
        flex: 1,
        backgroundColor: "transparent",
    },
    youtubeThumbnail: {
        width: "100%",
        height: "100%",
    },
    youtubeOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "rgba(255,0,0,0.85)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF0000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 10,
        paddingLeft: 4,
    },
    youtubeLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.3,
    },

    // ── Save button ──────────────────────────────────────
    saveSection: {
        marginTop: 32,
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 17,
        borderRadius: 18,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.3,
    },
});