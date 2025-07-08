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
    const API_URL = "https://gigaapp-y19k.onrender.com/api"

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(true);
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const navigation = useNavigation<NavigationProp<any>>();

    async function getSignUp() {
        try {
            setLoading(true);
            if(!name || !email || !password || !confirmPassword) {
                return Alert.alert("Sign up", "Please fill in all fields.");
            }
            if(password !== confirmPassword) {
                return Alert.alert("Sign up", "Passwords do not match.");
            }

            fetch("https://gigaapp-y19k.onrender.com/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })
            .then(async res => {
                setLoading(false);
                const contentType = res.headers.get("content-type");
                if (res.ok) {
                    if (contentType && contentType.includes("application/json")) {
                        Alert.alert("Sign up", "User registered successfully!");
                        navigation.reset({routes:[{name:"Login"}]});
                    } else {
                        Alert.alert("Sign up", "Unexpected response from server.");
                    }
                } else {
                    let data;
                    if (contentType && contentType.includes("application/json")) {
                        data = await res.json();
                    } else {
                        data = { message: "Unexpected error from server." };
                    }
                    Alert.alert("Sign up", data.message || "Registration failed.");
                }
            })
            .catch(error => {
                setLoading(false);
                Alert.alert("Sign up", "Network error.");
                console.log(error);
            });

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