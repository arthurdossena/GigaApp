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

    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    async function getLogin()
    {
        try {
            setLoading(true);
            if(!email || !password) {
                return Alert.alert("Login", "Preencha todos os campos.");
            }

            navigation.reset({routes:[{name:"BottomRoutes"}]});

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
                <Text style={style.text}>
                    Login
                </Text>
            </View>
            <View style={style.boxMid}>
                <Input
                    onChangeText={setEmail}
                    value={email}
                    title="Endereço de e-mail"
                    IconRight={MaterialIcons}
                    iconRightName="email"
                />
                <Input
                    onChangeText={setPassword}
                    value={password}
                    title="Senha"
                    IconRight={Octicons}
                    iconRightName={showPassword ? "eye-closed" : "eye"}
                    secureTextEntry={showPassword}
                    onIconRightPress={() => setShowPassword(!showPassword)}
                />
            </View>
            <View style={style.boxBottom}>
                <Button text={"Entrar"} loading={loading} onPress={()=>getLogin()}/>
            </View>
            <Text style={style.textBottom}>Não possui conta? <Text style={{color: themes.colors.primary}}>Crie sua conta.</Text></Text>
        </View>
    );
}