import React from 'react';
import { styles } from './styles';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function Routine() {
    const navigation = useNavigation<NavigationProp<any>>();

    const route = useRoute();
    const item:any = route.params;
    //console.log(item);

    const _renderExercise = ({item}: {item:Array<String>}) => (
        <View style={{paddingBottom:40}}>
            <Text style={styles.exerciseTitle}>{item}</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Sets</Text>
                <Text style={styles.tableHeaderText}>Kg</Text>
                <Text style={styles.tableHeaderText}>Reps</Text>
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