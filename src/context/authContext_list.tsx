import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Text, View, StyleSheet, TouchableOpacity, Platform, FlatList } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { Input } from "../components/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropCard, WorkoutSession } from "../global/Props";
import { FlashList } from "@shopify/flash-list";

export const AuthContextList:any = createContext({});

export const AuthProviderList = (props: any): any => {
    const API_URL = "https://gigaapp-y19k.onrender.com/api"; // URL do backend

    const {children, initialEmail} = props;
    const modalizeRef = useRef<Modalize>(null);
    const [userEmail, setUserEmail] = useState<string | null>(initialEmail);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [exerciseInputs, setExerciseInputs] = useState<Array<{ name: string; sets: string }>>([{ name: "", sets: "" }]);
    const [id, setId] = useState(0);
    //const [exerciseItemHeight, setExerciseItemHeight] = useState(0);
    const [routineList, setRoutineList] = useState<Array<PropCard>>([]);
    const [routineListBackup, setRoutineListBackup] = useState<Array<PropCard>>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState([]);

    // const handleLayout = (event: any) => {
    //     if (!event?.nativeEvent?.layout) return;
    //     event.persist && event.persist();
    //     const { height } = event.nativeEvent.layout;
    //     if (exerciseItemHeight === 0) {
    //         setExerciseItemHeight(height);
    //     }
    // };

    const handleAddExercise = () => {
        setExerciseInputs([...exerciseInputs, { name: "", sets: "" }]);
    };

    const handleExerciseChange = (text: string, index: number) => {
        const updated = [...exerciseInputs];
        updated[index].name = text;
        setExerciseInputs(updated);
    };

    const handleSetChange = (text: string, index: number) => {
        const updated = [...exerciseInputs];
        updated[index].sets = text.replace(/[^0-9]/g, '');
        setExerciseInputs(updated);
    };

    const removeExercise = (index: number) => {
        if (exerciseInputs.length === 1) return; // Prevent removing the last exercise
        const updatedExerciseInputs = exerciseInputs.filter((_, i) => i !== index);
        setExerciseInputs(updatedExerciseInputs);
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
        setExerciseInputs([{ name: "", sets: "" }]);
        setId(0);
    };

    const handleSave = async() => {
        if (!title.trim()) return Alert.alert("Please enter a title.");
        
        const normalizedTitle = title.trim().toLowerCase();

        const isDuplicate = routineList.some(
            routine =>
                routine.title.trim().toLowerCase() === normalizedTitle &&
                routine.id !== id // id is the current routine's id (if editing)
        );

        if (isDuplicate) {
            Alert.alert("Title already exists", "Please choose a unique title for your routine.");
            return;
        }

        const allExercisesValid = exerciseInputs.every(ex => ex.name.trim() !== "");
        const allSetsValid = exerciseInputs.every(ex => ex.sets.trim() !== "" && !isNaN(Number(ex.sets)) && Number(ex.sets) > 0);
        if (exerciseInputs.length === 1 && exerciseInputs[0].name === "" || exerciseInputs[0].sets === "")
            return Alert.alert("Please add at least one exercise.");
        if (exerciseInputs.some(exercise => exercise.name.trim() === ""))
            return Alert.alert("Please fill in all exercise fields.");
        if (exerciseInputs.some(exercise => !exercise.sets.trim() || isNaN(Number(exercise.sets)) || Number(exercise.sets) <= 0))
            return Alert.alert("Please fill in all sets fields with numbers greater than 0.");

        // Salvar e enviar ao backend
        // try {
        //     const exercisesForPropCard = exerciseInputs.map(ex => ({
        //         name: ex.name,
        //         sets: Number(ex.sets)
        //     }));

        //     const newItem: PropCard = {
        //         id: id !== 0 ? id : Date.now(),
        //         title,
        //         description,
        //         exercises: exercisesForPropCard,
        //     };

        //     const storageData = await AsyncStorage.getItem("routineList");
        //     let routineList:Array<any> = storageData ? JSON.parse(storageData) : [];

        //     const itemIndex = routineList.findIndex((routine)=>routine.id === newItem.id);

        //     if(itemIndex >= 0) {
        //         routineList[itemIndex] = newItem;
        //     } else {
        //         routineList.push(newItem);
        //     }

        //     await AsyncStorage.setItem("routineList", JSON.stringify(routineList));
        //     setRoutineList(routineList);
        //     setRoutineListBackup(routineList);

        //     console.log("Routine saved:", routineList);
    
        //     Alert.alert("Success", "Routine saved!");
        //     onClose();
        //     resetForm();
        // } catch (error) {
        //     console.error("Error saving routine:", error);
        // }
        try {
            const exercisesForPropCard = exerciseInputs.map(ex => ({
                name: ex.name,
                sets: Number(ex.sets)
            }));

            const routineData: Omit<PropCard, 'id'> & { id?: number; email: string } = {
                title,
                description,
                exercises: exercisesForPropCard,
                email: userEmail!,
            };

            // Adiciona o ID apenas se estiver editando (id !== 0)
            if (id !== 0) {
                routineData.id = id;
            }

            const response = await fetch(`${API_URL}/routines`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(routineData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save routine.");
            }
            
            // Após salvar com sucesso, busca a lista atualizada do servidor
            await getRoutineList();

            console.log("Routine saved successfully via API");

            Alert.alert("Success", "Routine saved!");
            onClose();
            resetForm();
        } catch (error) {
            console.error("Error saving routine:" , error);
            //Alert.alert("Error", error.message || "Could not save routine.");
        }
    };

    const handleSaveWorkoutSession = async (workoutData: WorkoutSession) => {
        try {
            const response = await fetch(`${API_URL}/history`, { // Usando o novo endpoint /history
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (!response.ok) {
                throw new Error("Falha ao salvar o histórico de treino.");
            }

            const savedSession = await response.json();
            console.log("Sessão de treino salva com sucesso:", savedSession);
            //Alert.alert("Sucesso!", "Seu treino foi salvo no histórico.");

        } catch (error) {
            console.error("Erro ao salvar a sessão de treino:", error);
            Alert.alert("Erro", "Não foi possível salvar seu treino.");
        }
    };

    const getWorkoutHistory = async () => {
        if (!userEmail) return;
        try {
            const response = await fetch(`${API_URL}/history?email=${encodeURIComponent(userEmail)}`);
            if (!response.ok) {
                throw new Error("Falha ao buscar o histórico de treinos.");
            }
            const historyData = await response.json();
            setWorkoutHistory(historyData);
        } catch (error) {
            console.error("Erro ao buscar o histórico de treinos:", error);
        }
    };

    async function getRoutineList() {
        // try {
        //     const storageData = await AsyncStorage.getItem("routineList");
        //     let routineList:Array<any> = storageData ? JSON.parse(storageData) : [];
        //     setRoutineList(routineList);
        //     setRoutineListBackup(routineList);
        // } catch (error) {
        //     console.error("Error fetching routine list:", error);
        // }
        try {
            if (!userEmail) {
                console.log("Aguardando e-mail do usuário para buscar rotinas.");
                return;      
            }
            const response = await fetch(`${API_URL}/routines?email=${encodeURIComponent(userEmail)}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch routines from server.");
            }
            const routineList = await response.json();
            setRoutineList(routineList);
            setRoutineListBackup(routineList);
        } catch (error) {
            console.error("Error fetching routine list:", error);
            // Opcional: Adicionar um Alert para o usuário
            Alert.alert("Error", "Could not load routines.");
        }
    }

    const handleDeleteWorkoutHistory = async (item: WorkoutSession) => {
        try {
            const response = await fetch(`${API_URL}/history/${item.id}?email=${encodeURIComponent(userEmail!)}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to delete workout history.");
            }

            console.log("Workout history deleted successfully.");
        } catch (error) {
            console.error("Error deleting workout history:", error);
            Alert.alert("Error", "Could not delete workout history.");
        }
    }
    
    const handleDelete = async (itemToDelete: PropCard) => {
        // try {
        //     const storageData = await AsyncStorage.getItem("routineList");
        //     let routineList:Array<any> = storageData ? JSON.parse(storageData) : [];
            
        //     const updatedList = routineList.filter((item: { id: number; }) => item.id !== itemToDelete.id);
            
        //     await AsyncStorage.setItem("routineList", JSON.stringify(updatedList));
        //     setRoutineList(updatedList);
        //     setRoutineListBackup(updatedList);
        // } catch (error) {
        //     console.error("Error deleting routine:", error);            
        // }
        try {
            const response = await fetch(`${API_URL}/routines/${itemToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                // Se o status não for 'No Content' (204) ou 'OK' (200), lança um erro
                if(response.status !== 204){
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to delete routine.");
                }
            }

            // Remove o item da lista localmente para uma atualização de UI instantânea
            const updatedList = routineList.filter((item) => item.id !== itemToDelete.id);
            setRoutineList(updatedList);
            setRoutineListBackup(updatedList);

            console.log("Routine deleted successfully via API");

        } catch (error) {
            console.error("Error deleting routine:", error);
            //Alert.alert("Error", error.message || "Could not delete the routine.");
        }
    }
    
    const handleEdit = async (itemToEdit: PropCard) => {
        try {
            setIsEditing(true);

            setTitle(itemToEdit.title);
            setDescription(itemToEdit.description);
            const exercisesForInputState = itemToEdit.exercises.map(ex => ({
                name: ex.name,
                sets: String(ex.sets)
            }));
            setExerciseInputs(exercisesForInputState);
            setId(itemToEdit.id);
            
            onOpen();
        } catch (error) {
            console.error("Error editing routine:", error);
        }
    }

    const filter = (text: string) => {
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
            resetForm();
            setIsEditing(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            getRoutineList();
            getWorkoutHistory();
        }
        else {
            setRoutineList([]);
            setRoutineListBackup([]);
            setWorkoutHistory([]);
        }
    }, [userEmail]);

    const _container = () => {
        return (
            <View style={styles.container}>
                    <View style={[styles.content,]}>
                        <Input
                            title="Title"
                            labelStyle={styles.label}
                            value={title}
                            onChangeText={setTitle}
                        />
                        <View style={{ width: "100%", marginBottom: 10 }}>
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
                        </View>
                        <FlashList
                            data={exerciseInputs}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{ width: "100%", marginBottom: 10, flexDirection: "row", height: 80 }}
                                    key={index}
                                >
                                    <View style={{ width: "60%" }}>
                                        <Input
                                            title={`Exercise ${index + 1}`}
                                            labelStyle={styles.label}
                                            value={item.name}
                                            onChangeText={(text) => handleExerciseChange(text, index)}
                                        />
                                    </View>
                                    <View style={{ justifyContent: "flex-end", marginBottom: 12, marginLeft: 10, marginRight: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>Sets:</Text>
                                    </View>
                                    <View style={{ width: "15%", justifyContent: "flex-end" }}>
                                        <Input
                                            value={item.sets}
                                            keyboardType="numeric"
                                            textAlign="center"
                                            onChangeText={(text) => handleSetChange(text, index)}
                                        />
                                    </View>
                                    <View style={{ width: "10%", justifyContent: "flex-end", alignItems: "center", paddingBottom: 10, marginLeft: 3, }}>
                                        {index > 0 && (
                                            <TouchableOpacity onPress={() => removeExercise(index)}>
                                                <AntDesign name="closecircleo" size={20} color={"red"} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                            estimatedItemSize={80}
                            ListFooterComponent={
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
                            }
                        />
                    </View>
            </View>
        )
    }

    return (
        <AuthContextList.Provider value={{onOpen, routineList, handleDelete, handleEdit, filter, userEmail, handleSaveWorkoutSession, workoutHistory, getWorkoutHistory, handleDeleteWorkoutHistory}}>
            {props.children}
            <Modalize
                ref={modalizeRef}
                onClose={handleCloseModal}
                //modalHeight={Dimensions.get("window").height * 0.85}
                adjustToContentHeight = {true}
                modalStyle={styles.container}
                scrollViewProps={{
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
        height: Dimensions.get("window").height * 0.8,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    }
})
