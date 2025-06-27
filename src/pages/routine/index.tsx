import React, { useState } from 'react';
import { styles } from './styles';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';

export default function Routine() {
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute();
    const item:any = route.params;

    const [inputs, setInputs] = useState<{ kg: string[]; reps: string[] }>({
        kg: Array(item.item.exercises.length).fill(''),
        reps: Array(item.item.exercises.length).fill(''),
    });

    const handleInputChange = (type: 'kg' | 'reps', index: number, value: string) => {
        const newValues = [...inputs[type]];
        newValues[index] = value.replace(/[^0-9]/g, '');
        setInputs({ ...inputs, [type]: newValues });
    };

    const _renderExercise = ({item, index}: {item:string, index:number}) => (
        <View style={{paddingBottom:40}}>
            <Text style={styles.exerciseTitle}>{item}</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Sets</Text>
                <Text style={styles.tableHeaderText}>Kg</Text>
                <Text style={styles.tableHeaderText}>Reps</Text>
            </View>
            <View style={[styles.tableHeader, {paddingHorizontal:10}]}>
                <Text style={[styles.tableHeaderText, {backgroundColor: "red"}]}>1</Text>
                <TextInput
                    style={[styles.tableHeaderText, {backgroundColor: "green"}]}
                    keyboardType="numeric"
                    inputMode="numeric"
                />
                <TextInput
                    style={[styles.tableHeaderText, {backgroundColor: "blue"}]}
                    keyboardType="numeric"
                    inputMode="numeric"
                    value={inputs.reps[index]}
                    onChangeText={text => handleInputChange('reps', index, text)}
                />
            </View>
            
        </View>
    )

    return (
    <View style={styles.container}>
        <Text style={styles.title}>{item?.item.title}</Text>
        <View style={{marginTop:10}}>
            <FlatList
                data={item.item.exercises}
                renderItem={_renderExercise}
            />
        </View>
    </View>
    );
}