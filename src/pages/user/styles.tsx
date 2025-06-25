import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.background,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    name: {
        fontSize: 24,
        color: "black",
        fontWeight: "bold",
        marginTop: 20,
    },
    logoutButton: {
        position: "absolute",
        bottom: 10,
        right: 20,
        padding: 10,
    },
});