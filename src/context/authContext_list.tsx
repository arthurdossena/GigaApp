import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { Input } from "../components/Input";

export const AuthContextList:any = createContext({});

export const AuthProviderList = (props: any): any => {
    const modalizeRef = useRef<Modalize>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [exercises, setExercises] = useState([""]);
    const [exerciseItemHeight, setExerciseItemHeight] = useState(0);

    const handleLayout = (event: any) => {
        event.persist();
        const { height } = event.nativeEvent.layout;
        if (exerciseItemHeight === 0) {
            setExerciseItemHeight(height);
        }
    };

    const handleAddExercise = () => {
        setExercises([...exercises, ""]);
    };

    const handleExerciseChange = (text: string, index: number) => {
        const updated = [...exercises];
        updated[index] = text;
        setExercises(updated);
    };

    const removeExercise = (index: number) => {
        if (index === 0) return;
        const updated = exercises.filter((_, i) => i !== index);
        setExercises(updated);
    };
    
    const onOpen = () => {
        modalizeRef?.current?.open();
    }

    const onClose = () => {
        modalizeRef?.current?.close();
    }

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setExercises([""]);
    };

    const onSubmit = () => {
        if (!title.trim()) return Alert.alert("Please enter a title.");
        if (!description.trim()) return Alert.alert("Please enter a description.");
        if (exercises.length === 1 && exercises[0] === "") return Alert.alert("Please add at least one exercise.");
        if (exercises.some(exercise => exercise.trim() === "")) {
            return Alert.alert("Please fill in all exercise fields.");
        }

        // Salvar e enviar ao backend
        Alert.alert("Success", "Routine saved!");
        onClose();
        resetForm();
    };

    // Abrir o modalize automaticamente ao carregar o componente
    useEffect(() => {
        onOpen();
    }, []);

    const _container = () => {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={100}
            >
                <View style={styles.container}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={[
                            styles.content,
                            exercises.length > 3 && {
                            height:
                                Dimensions.get("window").height * 0.85 + (exercises.length - 3) * (exerciseItemHeight+10),
                            } || { height: Dimensions.get("window").height * 0.85 },
                        ]}>
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
                            {exercises.map((exercise, index) => (
                                <View
                                    key={index}
                                    style={{ width: "100%", marginBottom: 5, flexDirection: "row" }}
                                    onLayout={index === 0 ? handleLayout : undefined}>
                                    <View style={{width: "90%"}}>
                                        <Input
                                            title={`Exercise ${index + 1}`}
                                            labelStyle={styles.label}
                                            value={exercise}
                                            onChangeText={(text) => handleExerciseChange(text, index)}
                                        />
                                    </View>
                                    <View key={index} style={{ width: "10%", justifyContent: "flex-end", alignItems: "center", paddingBottom: 10 }}>
                                        {index > 0 && (
                                            <TouchableOpacity onPress={() => removeExercise(index)}>
                                                <AntDesign name="closecircleo" size={20} color={"red"} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                            <TouchableOpacity
                                onPress={handleAddExercise}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginVertical: 10,
                                }}
                            >
                                <AntDesign name="pluscircleo" size={20} />
                                <Text style={{ marginLeft: 8 }}>Add Exercise</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        )
    }

    return (
        <AuthContextList.Provider value={{onOpen}}>
            {props.children}
            <Modalize
                ref={modalizeRef}
                adjustToContentHeight={false}
                scrollViewProps={{
                    //contentContainerStyle: { paddingBottom: 100 },
                    keyboardShouldPersistTaps: "handled"
                }}
                HeaderComponent={
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
                }
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
        //height: Dimensions.get("window").height * 0.85,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000"
    }
})