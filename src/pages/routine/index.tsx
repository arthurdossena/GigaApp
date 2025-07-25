import React, { useContext, useState } from 'react';
import { styles } from './styles';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { themes } from '../../global/themes'; 
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { AuthContextType, PropCard } from '../../global/Props';
import { AuthContextList } from '../../context/authContext_list';

type RoutineRouteParams = {
  item: PropCard;
};

export default function Routine() {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute<RouteProp<{ Routine: RoutineRouteParams }, 'Routine'>>();
    const routineData: PropCard = route.params?.item;
    const { handleSaveWorkoutSession, userEmail } = useContext<AuthContextType>(AuthContextList);

    const handleDelete = () => {
        Alert.alert(
            "Exit Routine",
            "Are you sure you want to exit without saving this routine?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Exit",
                    onPress: () => {
                        navigation.goBack();
                    }
                }
            ]
        );
    }

    const handleFinish = () => {

        let totalWeightLifted = 0;

        // Itera sobre os exercícios da rotina
        routineData.exercises.forEach(exercise => {
            // Itera sobre cada série do exercício
            Array.from({ length: exercise.sets }).forEach((_, setIndex) => {
                // Verifica se a série foi marcada no estado checkedSets
                if (checkedSets[exercise.name]?.[setIndex]) {
                    const kgValue = parseFloat(inputs[exercise.name].kg[setIndex]?.replace(',', '.') || '0');
                    const repsValue = parseInt(inputs[exercise.name].reps[setIndex] || '0', 10);

                    // Adiciona o produto (kg * reps) ao total
                    if (!isNaN(kgValue) && !isNaN(repsValue)) {
                        totalWeightLifted += kgValue * repsValue;
                    }
                }
            });
        });

        if (totalWeightLifted === 0) {
            Alert.alert("Atenção", "Você precisa preencher e marcar pelo menos uma série para finalizar o treino.");
            return;
        }

        Alert.alert(
            "Finish Routine",
            `Are you sure you want to finish this routine with ${totalWeightLifted.toFixed(2)} kg lifted?`,           [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Finish and save",
                    onPress: () => {
                        const workoutData = {
                            routineId: routineData.id,
                            title: routineData.title,
                            date: new Date(),
                            weightLifted: totalWeightLifted,
                            email: userEmail!,
                        };
                        // Chama a função do contexto para salvar os dados
                        handleSaveWorkoutSession(workoutData);
                        navigation.goBack();
                    }
                }
            ]
        );
    }

    if (!routineData) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Erro: Dados da rotina não encontrados.</Text>
            </View>
        );
    }

    const initialInputsState = routineData.exercises.reduce((acc: any, exercise: { name: string; sets: number; }) => {
        acc[exercise.name] = {
            kg: Array(exercise.sets).fill(''), 
            reps: Array(exercise.sets).fill(''), 
        };
        return acc;
    }, {});

    const [inputs, setInputs] = useState<{ [exerciseName: string]: { kg: string[]; reps: string[] } }>(initialInputsState);
    const [checkedSets, setCheckedSets] = useState<{ [key: string]: boolean[] }>({});

    const handleInputChange = (
        exerciseName: string,
        type: 'kg' | 'reps',
        setIndex: number,
        value: string
    ) => {
        setInputs(prevInputs => {
            const newInputs = { ...prevInputs };
            if (!newInputs[exerciseName]) {
                newInputs[exerciseName] = { kg: [], reps: [] };
            }
            const newValues = [...newInputs[exerciseName][type]];
            if (type === 'kg') {
                newValues[setIndex] = value.replace(/[^0-9.,]/g, '');
            } else {
                newValues[setIndex] = value.replace(/[^0-9]/g, '');
            }
            newInputs[exerciseName][type] = newValues;

            if (value.trim() === '') {
                setCheckedSets(prevChecked => {
                    const updatedChecked = { ...prevChecked };
                    if (updatedChecked[exerciseName] && updatedChecked[exerciseName][setIndex]) {
                        updatedChecked[exerciseName][setIndex] = false;
                    }
                    return updatedChecked;
                });
            }
            
            return newInputs;
        });
    };

    const _renderExercise = ({ item: exercise }: { item: { name: string; sets: number } }) => (
        <View style={{ paddingBottom: 40 }}>
            <Text style={styles.exerciseTitle}>{exercise.name}</Text>
            <View style={[styles.tableHeader, { borderBottomWidth: 2 }]}>
                <View style={styles.tableHeaderView}>
                    <Text style={styles.tableHeaderText}>Sets</Text>
                </View>
                <View style={styles.tableHeaderView}>
                    <Text style={styles.tableHeaderText}>Kg</Text>
                </View>
                <View style={styles.tableHeaderView}>
                    <Text style={styles.tableHeaderText}>Reps</Text>
                </View>
                <View style={styles.tableHeaderView}>
                    <Entypo name="check" size={24} color={themes.colors.black} />
                </View>
            </View>
            {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                <View key={`${exercise.name}-${setIndex}`} style={[styles.tableHeader, { backgroundColor: themes.colors.background }]}>
                    <View style={styles.tableHeaderView}>
                        <Text style={[styles.tableText, { textAlign: "center", fontWeight: "bold" }]}>{String(setIndex + 1)}</Text>
                    </View>
                    <View style={styles.tableHeaderView}>
                        <TextInput
                            style={[styles.tableText, { textAlign: "center", width: "100%" }]}
                            keyboardType="numeric"
                            inputMode="numeric"
                            value={inputs[exercise.name]?.kg[setIndex] || ''}
                            onChangeText={text => handleInputChange(exercise.name, 'kg', setIndex, text)}
                        />
                    </View>
                    <View style={styles.tableHeaderView}>
                        <TextInput
                            style={[styles.tableText, { textAlign: "center", width: "100%" }]}
                            keyboardType="numeric"
                            inputMode="numeric"
                            value={inputs[exercise.name]?.reps[setIndex] || ''}
                            onChangeText={text => handleInputChange(exercise.name, 'reps', setIndex, text)}
                        />
                    </View>
                    <View style={styles.tableHeaderView}>
                        <TouchableOpacity
                            style={styles.checkButton}
                            onPress={() => {
                                const kgValue = inputs[exercise.name]?.kg[setIndex];
                                const repsValue = inputs[exercise.name]?.reps[setIndex];

                                if (!kgValue || kgValue.trim() === "") {
                                    return Alert.alert("Error", "Please fill in the Kg field before checking.");
                                }
                                if (!repsValue || repsValue.trim() === "") {
                                    return Alert.alert("Error", "Please fill in the Reps field before checking.");
                                }

                                setCheckedSets(prev => {
                                    const updated = { ...prev };
                                    if (!updated[exercise.name]) updated[exercise.name] = [];
                                    updated[exercise.name][setIndex] = !updated[exercise.name][setIndex];
                                    return updated;
                                });
                            }}
                        >
                            {checkedSets?.[exercise.name]?.[setIndex] && (
                                <Entypo name="check" size={18} color={themes.colors.primary} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleDelete}>
                    <MaterialIcons name="close" size={28}/>
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={3}>{routineData.title}</Text>
                <TouchableOpacity onPress={handleFinish}>
                    <AntDesign name="check" size={28}/>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10 }}>
                <FlatList
                    data={routineData.exercises}
                    renderItem={_renderExercise}
                    keyExtractor={(item) => item.name} 
                />
            </View>
        </View>
    );
}