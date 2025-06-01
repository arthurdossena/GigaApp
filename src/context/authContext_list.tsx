import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { Input } from "../components/Input";

export const AuthContextList:any = createContext({});

export const AuthProviderList = (props: any): any => {
    const modalizeRef = useRef<Modalize>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [exercises, setExercises] = useState<string[]>([]);
    
    const onOpen = () => {
        modalizeRef?.current?.open();
    }

    const onClose = () => {
        modalizeRef?.current?.close();
    }

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setExercises([]);

        Alert.alert("Form reset", "The form has been reset successfully.");
    };

    const onSubmit = () => {
        if (!title.trim()) return Alert.alert("Please enter a title.");
        if (!description.trim()) return Alert.alert("Please enter a description.");
        if (exercises.length === 0 || exercises[0] === "") return Alert.alert("Please add at least one exercise.");

        // Salvar e enviar ao backend
        Alert.alert("Success", "Routine saved!");
        onClose();
        resetForm();
    };

    useEffect(() => {
        onOpen();
    }, []);

    const _container = () => {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        onClose();
                        resetForm();
                    }}>
                        <MaterialIcons name="close" size={28}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Create workout routine</Text>
                    <TouchableOpacity onPress={onSubmit}>
                        <AntDesign name="check" size={28}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <Input
                        title="Title"
                        labelStyle={styles.label}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Input
                        title="Description"
                        labelStyle={styles.label}
                        height={80}
                        multiline={true}
                        numberOfLines={3}
                        textAlignVertical="top"
                        value={description}
                        onChangeText={setDescription}                        
                    />
                    <View style={{width: "85%" }}>
                        <Input
                            title="Exercises"
                            labelStyle={styles.label}
                            value={exercises.join(", ")}
                            onChangeText={(text) => setExercises(text.split(",").map(item => item.trim()))}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }

    return (
        <AuthContextList.Provider value={{onOpen}}>
            {props.children}
            <Modalize
                ref={modalizeRef}
                childrenStyle={{height: Dimensions.get("window").height * 0.85}}
                adjustToContentHeight={true}
            >
                {_container()}
            </Modalize>
        </AuthContextList.Provider>
    )
}

export const useAuth = () => useContext(AuthContextList);

export const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    header: {
        width: "100%",
        height: 40,
        paddingHorizontal: 20,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginTop: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    content: {
        width: "100%",
        height: Dimensions.get("window").height * 0.85,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000"
    }
})