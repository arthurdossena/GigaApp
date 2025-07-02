import React, { useContext} from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { style } from '../home/styles';
import { Input } from '../../components/Input';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { themes } from '../../global/themes';
import { AuthContextList } from '../../context/authContext_list';
import { AuthContextType, PropCard } from '../../global/Props';
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function Home() {

  const navigation = useNavigation<NavigationProp<any>>();

  const {routineList, handleDelete, handleEdit, filter} = useContext<AuthContextType>(AuthContextList);

  const _renderCard = (item: PropCard) => {
    return (
      <TouchableOpacity style={style.card} activeOpacity={0.4} onPress={() => handleEdit(item)}>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
          <TouchableOpacity style={style.buttonPlay} activeOpacity={0.4} onPress={() => navigation.navigate("Routine", {item})}>
              <Entypo name="controller-play" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 10, justifyContent: "flex-start", alignItems: "flex-start", flex: 1, backgroundColor: "white" }}>
          <Text style={style.titleCard} numberOfLines={2}>{item.title}</Text>
          <Text style={style.descriptionCard} numberOfLines={3}>{item.description}</Text>
          <Text style={style.exercisesCard} numberOfLines={2}>
            {item.exercises.map(ex => ex.name).join(', ')}
          </Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
          <TouchableOpacity style={style.buttonRemove} activeOpacity={0.4} onPress={() => handleDelete(item)}>
            <FontAwesome5 name="trash-alt" size={14} color={themes.colors.primary} />
          </TouchableOpacity>
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
            onChangeText={(text) => filter(text)}
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