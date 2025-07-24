import React from 'react';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function User() {
  const navigation = useNavigation<NavigationProp<any>>();

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

  return (
    <View style={styles.container}>
        <Text style={styles.name}>User</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="exit" size={24} color="gray"/>
        </TouchableOpacity>
      </View>
  );
}