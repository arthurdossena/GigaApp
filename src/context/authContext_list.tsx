import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { Input } from "../components/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropCard } from "../global/Props";

export const AuthContextList:any = createContext({});

export const AuthProviderList = (props: any): any => {
    const modalizeRef = useRef<Modalize>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [exercises, setExercises] = useState([""]);
    const [sets, setSets] = useState([""]);
    const [id, setId] = useState(0);
    const [exerciseItemHeight, setExerciseItemHeight] = useState(0);
    const [routineList, setRoutineList] = useState<Array<PropCard>>([]);
    const [routineListBackup, setRoutineListBackup] = useState<Array<PropCard>>([]);
    const [isEditing, setIsEditing] = useState(false);

    const handleLayout = (event: any) => {
        event.persist();
        const { height } = event.nativeEvent.layout;
        if (exerciseItemHeight === 0) {
            setExerciseItemHeight(height);
        }
    };

    const handleAddExercise = () => {
        setExercises([...exercises, ""]);
        setSets([...sets, ""]);
    };

    const handleExerciseChange = (text: string, index: number) => {
        const updated = [...exercises];
        updated[index] = text;
        setExercises(updated);
    };

    const handleSetChange = (text: string, index: number) => {
        const updated = [...sets];
        updated[index] = text.replace(/[^0-9]/g, '');
        setSets(updated);
    };

    const removeExercise = (index: number) => {
        if (index === 0) return;
        const updatedExercises = exercises.filter((_, i) => i !== index);
        const updatedSets = sets.filter((_, i) => i !== index);
        setExercises(updatedExercises);
        setSets(updatedSets);
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
        setSets([""]);
        setId(0);
    };

    const handleSave = async() => {
        if (!title.trim()) return Alert.alert("Please enter a title.");
        //if (!description.trim()) return Alert.alert("Please enter a description.");
        if (exercises.length === 1 && exercises[0] === "") return Alert.alert("Please add at least one exercise.");
        if (exercises.some(exercise => exercise.trim() === "")) {
            return Alert.alert("Please fill in all exercise fields.");
        }
        if (sets.some(set => !set.trim() || isNaN(Number(set)) || Number(set) <= 0)) {
            return Alert.alert("Please fill in all sets fields with numbers greater than 0.");
        }

        // Salvar e enviar ao backend
        try {
            const newItem = {
                id: id !== 0 ? id : Date.now(),
                title,
                description,
                exercises,
                sets
            }

            const storageData = await AsyncStorage.getItem("routineList");
            let routineList:Array<any> = storageData ? JSON.parse(storageData) : [];

            const itemIndex = routineList.findIndex((routine)=>routine.id === newItem.id);

            if(itemIndex >= 0) {
                routineList[itemIndex] = newItem;
            } else {
                routineList.push(newItem);
            }

            await AsyncStorage.setItem("routineList", JSON.stringify(routineList));
            setRoutineList(routineList);
            setRoutineListBackup(routineList);

            console.log("Routine saved:", routineList);
    
            Alert.alert("Success", "Routine saved!");
            onClose();
            resetForm();
        } catch (error) {
            console.error("Error saving routine:", error);
        }
    };

    async function getRoutineList() {
        try {
            const storageData = await AsyncStorage.getItem("routineList");
            let routineList:Array<any> = storageData ? JSON.parse(storageData) : [];
            setRoutineList(routineList);
            setRoutineListBackup(routineList);
        } catch (error) {
            console.error("Error fetching routine list:", error);
        }
    }
    
    const handleDelete = async (itemToDelete: PropCard) => {
        try {
            const storageData = await AsyncStorage.getItem("routineList");
            let routineList:Array<any> = storageData ? JSON.parse(storageData) : [];
            
            const updatedList = routineList.filter((item: { id: number; }) => item.id !== itemToDelete.id);
            
            await AsyncStorage.setItem("routineList", JSON.stringify(updatedList));
            setRoutineList(updatedList);
            setRoutineListBackup(updatedList);
        } catch (error) {
            console.error("Error deleting routine:", error);            
        }
    }
    
    const handleEdit = async (itemToEdit: PropCard) => {
        try {
            setIsEditing(true);

            setTitle(itemToEdit.title);
            setDescription(itemToEdit.description);
            setExercises(itemToEdit.exercises);
            setSets(itemToEdit.sets)
            setId(itemToEdit.id);
            
            onOpen();
        } catch (error) {
            console.error("Error editing routine:", error);
        }
    }

    const filter =  (text: string) => {
        if(routineListBackup.length === 0) return;

        const array = routineListBackup;
        const fields = ["title", "description"];

        if(text){
            const searchTerm = text.trim().toLowerCase();

            const filteredArray = array.filter((item: any) => {
                for(let i=0; i<fields.length; i++) {
                    if(item[fields[i]].trim().toLowerCase().includes(searchTerm)) {
                        return true;
                    }
            }})

            setRoutineList(filteredArray);
        } else {
            setRoutineList(array);
        }

    }

    const handleCloseModal = () => {
        if (isEditing) {
            resetForm(); // your form reset logic
            setIsEditing(false);
        }
    };

    useEffect(() => {
        getRoutineList();
    }, []);

    const _container = () => {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={0}
            >
                <View style={styles.container}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingTop:2, paddingBottom: 2, justifyContent: "center", alignItems: "center" }}
                    >
                        <View style={[
                            styles.content,
                            exercises.length > 3 && {
                            height:
                                Dimensions.get("window").height * 0.8 + (exercises.length - 3) * (80+10),
                            } || { height: Dimensions.get("window").height * 0.8 },
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
                                    style={{ width: "100%", marginBottom: 0, flexDirection: "row"}}
                                    //onLayout={index === 0 ? handleLayout : undefined}
                                    >
                                    <View style={{width: "60%"}}>
                                        <Input
                                            title={`Exercise ${index + 1}`}
                                            labelStyle={styles.label}
                                            value={exercise}
                                            onChangeText={(text) => handleExerciseChange(text, index)}
                                        />
                                    </View>
                                    <View style={{justifyContent:"flex-end", marginBottom: 12, marginLeft: 10, marginRight: 5}}>
                                        <Text style={{fontWeight: "bold"}}>Sets:</Text>
                                    </View>
                                    <View style={{width: "15%", justifyContent: "flex-end"}}>
                                        <Input
                                            value={sets[index]}
                                            keyboardType="numeric"
                                            textAlign="center"
                                            onChangeText={(text) => handleSetChange(text, index)}
                                        />
                                    </View>
                                    <View key={index} style={{ width: "10%", justifyContent: "flex-end", alignItems: "center", paddingBottom: 10, marginLeft:3 }}>
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
        <AuthContextList.Provider value={{onOpen, routineList, handleDelete, handleEdit, filter}}>
            {props.children}
            <Modalize
                ref={modalizeRef}
                onClose={handleCloseModal}
                adjustToContentHeight={true}
                modalStyle={styles.container}
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
                    <TouchableOpacity onPress={handleSave}>
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
        width: "98%",
        //height: Dimensions.get("window").height * 0.85,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000"
    }
})