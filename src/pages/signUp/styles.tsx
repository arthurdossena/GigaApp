import { Dimensions, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    boxTop: {
        width: "100%",
        height: Dimensions.get("window").height * 0.2,
        backgroundColor: themes.colors.secondary,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 40,
    },
    boxMid: {
        width: "100%",
        height: Dimensions.get("window").height * 0.4,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    boxBottom: {
        width: "100%",
        height: Dimensions.get("window").height * 0.2,
        //justifyContent: "center",
        paddingTop: 60,
        alignItems: "center",
    },
    logo: {
        width: 100,
        height: 100,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 40
    },
    button: {
        width: 200,
        height: 50,
        backgroundColor: themes.colors.primary,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    textButton: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    textBottom: {
        fontSize: 14,
        color: themes.colors.gray,
        textAlign: "center",
    }
});