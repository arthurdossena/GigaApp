import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
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
    name: {
        fontSize: 24,
        color: "black",
        fontWeight: "bold",
        marginTop: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    logoutButton: {
        position: "absolute",
        bottom: 10,
        right: 20,
        padding: 10,
    },
    historyItem: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'column',
        width: "100%",
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    historyDate: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyWeight: {
        fontSize: 14,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: 'gray',
    }
});