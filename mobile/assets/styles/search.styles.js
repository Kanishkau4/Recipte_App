import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const searchStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.text,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.text,
        fontWeight: "500",
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    row: {
        justifyContent: "space-between",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.text,
        textAlign: "center",
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: "center",
    },
});