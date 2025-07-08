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

export default function Login()
{
    const API_URL = "https://gigaapp-y19k.onrender.com/api"; // URL do backend

    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    async function getLogin() {
        try {
            setLoading(true);
            if(!email || !password) {
                setLoading(false);
                return Alert.alert("Login", "Please fill in all fields.");
            }

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            setLoading(false);

            if (response.ok) {
                const data = await response.json();
                // Optionally save user info here (e.g., context, AsyncStorage)
                navigation.reset({routes:[{name:"BottomRoutes"}]});
            } else {
                const data = await response.json();
                Alert.alert("Login", data.message || "Login failed.");
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("Login", "Network error.");
            console.log(error);
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
            </View>
            <View style={style.boxBottom}>
                <Button text={"Login"} loading={loading} onPress={()=>getLogin()}/>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Text style={style.textBottom}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={{color: themes.colors.primary}}> Sign up.</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}