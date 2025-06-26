import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.background,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 40,
    },
    title: {
        fontSize: 24,
        color: "black",
        fontWeight: "bold",
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    tableHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    exerciseTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
    }
});