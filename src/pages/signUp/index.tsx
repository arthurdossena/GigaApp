import React from "react";
import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { style } from "./styles";
import Logo from "../../assets/logo.png";
import {MaterialIcons, Octicons} from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function SignUp() {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(true);
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const navigation = useNavigation<NavigationProp<any>>();

    function getSignUp() {
        try {
            setLoading(true);
            if(!name || !email || !password || !confirmPassword) {
                return Alert.alert("Sign up", "Please fill in all fields.");
            }
            if(password !== confirmPassword) {
                return Alert.alert("Sign up", "Passwords do not match.");
            }

            navigation.reset({routes:[{name:"Login"}]});

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={style.container}>
                    <View style={style.boxTop}>
                        <Image
                            source={Logo}
                            style={style.logo}
                            resizeMode="contain"
                            />
                    </View>
                    <View style={style.boxMid}>
                        <Input
                            onChangeText={setName}
                            value={name}
                            title="Name"
                        />
                        <Input
                            onChangeText={setEmail}
                            value={email}
                            title="Email"
                            IconRight={MaterialIcons}
                            iconRightName="email"
                        />
                        <Input
                            onChangeText={setPassword}
                            value={password}
                            title="Password"
                            IconRight={Octicons}
                            iconRightName={showPassword ? "eye-closed" : "eye"}
                            secureTextEntry={showPassword}
                            onIconRightPress={() => setShowPassword(!showPassword)}
                        />
                        <Input
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                            title="Confirm password"
                            IconRight={Octicons}
                            iconRightName={showPassword ? "eye-closed" : "eye"}
                            secureTextEntry={showPassword}
                            onIconRightPress={() => setShowPassword(!showPassword)}
                        />
                    </View>
                    <View style={style.boxBottom}>
                        <Button text={"Sign Up"} loading={loading} onPress={() => getSignUp()}/>
                    </View>
                </View>
            );
}