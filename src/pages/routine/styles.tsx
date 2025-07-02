import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.white,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 40,
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        marginTop: 20,
        minHeight: 56, // allow header to grow if needed
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 26,
        color: "black",
        fontWeight: "bold",
        marginTop: 0,
        marginHorizontal: 20,
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between",
        width: "100%",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    tableHeaderView: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
        //backgroundColor: themes.colors.primary,
    },
    tableHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    tableText: {
        fontSize: 16,
        color: "black",
    },
    exerciseTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
    checkButton: {
        justifyContent: "center",
        alignItems: "center",
        width: 25,
        height: 25,
        borderWidth: 1,
        borderColor: themes.colors.black,
        backgroundColor: themes.colors.white,
        borderRadius: 3,
    },
});