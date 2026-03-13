import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const recipeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerImage: {
        width: width,
        height: 350,
        backgroundColor: COLORS.border,
    },
    headerButtons: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        paddingTop: 32,
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 24,
    },
    category: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 16,
    },
    ingredientsList: {
        gap: 12,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: COLORS.card,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    ingredientDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
    },
    ingredientText: {
        fontSize: 15,
        color: COLORS.text,
        flex: 1,
    },
    instructionsList: {
        gap: 20,
    },
    instructionStep: {
        flexDirection: 'row',
        gap: 16,
    },
    stepNumberContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumber: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
    },
    instructionText: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
        flex: 1,
    },
    youtubeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF0000',
        paddingVertical: 16,
        borderRadius: 20,
        marginTop: 32,
        marginBottom: 40,
        gap: 10,
    },
    youtubeButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
});
