import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    boxInput: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: themes.colors.lightGray,
        borderColor: themes.colors.lightGray,
        paddingVertical: 5,
    },
    input: {
        width: "85%",
        height: "100%",
        borderRadius: 20,
    },
    titleInput: {
        fontSize: 16,
        color: themes.colors.gray,
        marginBottom: 8,
        marginTop: 20,
        marginLeft: 5,
    },
    icon: {
        width: "100%",
    },
    button: {
        width: "10%",
    },
});
