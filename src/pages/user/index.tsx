import React, { useEffect } from 'react';
import { styles } from './styles';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContextList } from '../../context/authContext_list';
import { AuthContextType } from '../../global/Props';
import { FlashList } from '@shopify/flash-list';
import { themes } from '../../global/themes';
import { WorkoutSession } from '../../global/Props'; // Assuming Work is defined in Props

export default function User() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [name, setName] = React.useState("");

  const { workoutHistory, getWorkoutHistory, userEmail, handleDeleteWorkoutHistory } = React.useContext<AuthContextType>(AuthContextList);

  useEffect(() => {
    getWorkoutHistory();
  }, [workoutHistory.length]);

  useEffect(() => {
    fetchUserName();
  }, [userEmail]);

  const fetchUserName = async () => {
      if (userEmail) {
          try {
              const response = await fetch(`https://gigaapp-y19k.onrender.com/api/username?email=${userEmail}`);
              
              // Se a resposta não for OK, lança um erro e vai para o catch
              if (!response.ok) {
                  throw new Error('Falha ao buscar nome do usuário.');
              }
              
              const data = await response.json();
              setName(data.name);

          } catch (error) {
              console.error("Error fetching user name:", error);
              // Opcional: defina um nome padrão em caso de erro
              setName("Guest"); 
          }
      }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => {
          //console.log("User logged out");
          return navigation.reset({routes:[{name: "Login"}]}); // Navigate to Login screen after logout
        }
      }
    ]);
  };

  const renderHistoryItem = ({ item }: { item: WorkoutSession } ) => (
    <View style={styles.historyItem}>
      <View>
        <Text style={styles.historyTitle}>
          {item.title}
        </Text>
        <Text style={styles.historyDate}>
          {new Date(item.date).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.historyWeight}>
          Total Lifted: {item.weightLifted.toFixed(2)} kg
        </Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: "white", height: "100%"}}>
        <TouchableOpacity style={styles.buttonRemove} activeOpacity={0.4} onPress={() => handleDeleteWorkoutHistory(item)}>
          <FontAwesome5 name="trash-alt" size={14} color={themes.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="exit" size={24} color="white"/>
        </TouchableOpacity>
      </View>
      <View style={styles.content}> 
        <FlashList
          data={workoutHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => String(item.date)}
          estimatedItemSize={70} // Altura estimada de cada item para otimização
          ListEmptyComponent={() => (
              <Text style={styles.emptyText}>You have no workout history yet.</Text>
          )}
          // contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>
    </View>
  );
}