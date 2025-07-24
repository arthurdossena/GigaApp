import React, { useEffect } from 'react';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContextList } from '../../context/authContext_list';
import { AuthContextType } from '../../global/Props';
import { FlashList } from '@shopify/flash-list';

export default function User() {
  const navigation = useNavigation<NavigationProp<any>>();

  const { workoutHistory, getWorkoutHistory } = React.useContext<AuthContextType>(AuthContextList);

  useEffect(() => {
    getWorkoutHistory();
  }, [workoutHistory]);

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

  const renderHistoryItem = ({ item }: { item: { routineId: number, date: Date, weightLifted: number, email: string } }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyDate}>
        {new Date(item.date).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={styles.historyWeight}>
        Total Lifted: {item.weightLifted.toFixed(2)} kg
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>User</Text>
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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="exit" size={24} color="gray"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}