import React, { useContext} from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { style } from '../home/styles';
import { Input } from '../../components/Input';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { themes } from '../../global/themes';
import { AuthContextList } from '../../context/authContext_list';
import { AuthContextType } from '../../global/Props';

type PropCard = {
  id: number;
  title: string;
  description: string;
  exercises: string[];
}

export default function Home() {

  const {routineList} = useContext<AuthContextType>(AuthContextList);

  const _renderCard = (item: PropCard) => {
    return (
      <TouchableOpacity style={style.card} activeOpacity={0.4}>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
          <TouchableOpacity>
            <View style={{width: 35, height: 35, backgroundColor: themes.colors.primary, borderRadius: 30, justifyContent: 'center', alignItems: 'center', paddingLeft:2}}>
              <Entypo name="controller-play" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 10, justifyContent: "flex-start", alignItems: "flex-start", flex: 1, backgroundColor: "white" }}>
          <Text style={style.titleCard}>{item.title}</Text>
          <Text style={style.descriptionCard}>{item.description}</Text>
          <Text style={style.exercisesCard}>{item.exercises.join(', ')}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.greeting}>Welcome back!</Text>
        <View style={style.boxInput}>
          <Input
            placeholder="Search your routine..."
            IconLeft={MaterialIcons}
            iconLeftName='search'
            backgroundColor='white'
          />
        </View>
      </View>
      <View style={style.boxList}>
        <FlatList
          data={routineList}
          style={{marginTop:10,paddingHorizontal: 20}}
          keyExtractor={(item, index) => item.id? String(item.id) : String(index)}
          renderItem={({ item }) => {return (_renderCard(item))}}
        />
      </View>
    </View>
  );
}