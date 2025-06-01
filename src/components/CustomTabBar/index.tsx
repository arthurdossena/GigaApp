import React, { useContext } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { style } from "./styles";
import { AntDesign, Entypo, Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContextList } from "../../context/authContext_list";

// Define the type for 'state'
interface State {
    index: number; // Add other properties if needed
}

// Define the type for 'navigation'
interface Navigation {
    navigate: (screenName: string) => void;
}

// Update the component
export default ({ state, navigation }: { state: State; navigation: Navigation }) => {

    const {onOpen} = useContext<any>(AuthContextList);

    const go = (screenName: string) => {
        navigation.navigate(screenName);
    };

    return (
        <View style={style.tabArea}>
            <TouchableOpacity style={style.tabItem} onPress={() => go("Home")}>
                <AntDesign
                    name="home"
                    size={32}
                    style={{ opacity: state.index === 0 ? 1 : 0.3 }}
                />
            </TouchableOpacity>
            <TouchableOpacity style={style.tabItemButton} onPress={()=>onOpen()}>
                <View style={{ width: "100%", left: 8, top: 8 }}>
                    <Entypo name="plus" size={32} color="white" />
                </View>
                <View
                    style={{
                        flexDirection: "row-reverse",
                        width: "100%",
                        right: 10,
                        bottom: 10,
                    }}
                >
                    <MaterialCommunityIcons
                        style={{ transform: [{ scaleY: -1 }] }}
                        name="dumbbell"
                        size={40}
                        color="white"
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={style.tabItem} onPress={() => go("User")}>
                <Feather
                    name="user"
                    size={32}
                    style={{ opacity: state.index === 1 ? 1 : 0.3 }}
                />
            </TouchableOpacity>
        </View>
    );
};