import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.background,
    },
    header: {
        width: "100%",
        height: Dimensions.get("window").height * 0.18,
        backgroundColor: themes.colors.primary,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    greeting: {
        fontSize: 18,
        color: themes.colors.white,
        marginTop: 30,
    },
    boxInput: {
        width: "80%",
        marginTop: 10
    },
    boxList: {
        flex: 1,
        width: "100%",
        backgroundColor: themes.colors.background,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 10,
        borderRadius: 15,
        flexDirection: 'row',
    },
    titleCard: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionCard: {
        fontSize: 14,
        color: 'black',
    },
    exercisesCard: {
        fontSize: 12,
        color: 'gray',
    },
    buttonRemove: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themes.colors.white,
    },
    buttonPlay: {
        width: 35,
        height: 35,
        backgroundColor: themes.colors.primary,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 2,
    },
});