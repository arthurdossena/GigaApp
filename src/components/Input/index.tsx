import React, {forwardRef, Ref} from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity, StyleProp, TextStyle } from "react-native";
import { style } from "./styles";
import {FontAwesome, MaterialIcons, Octicons} from "@expo/vector-icons";
import { themes } from "../../global/themes";

type IconComponent = React.ComponentType<React.ComponentProps<typeof MaterialIcons>> |
                     React.ComponentType<React.ComponentProps<typeof FontAwesome>> | 
                     React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
    IconLeft?: IconComponent,
    IconRight?: IconComponent,
    title?: string,
    iconLeftName?: string,
    iconRightName?: string,
    onIconLeftPress?: () => void,
    onIconRightPress?: () => void,
    backgroundColor?: string,
    height?: number,
    labelStyle?:StyleProp<TextStyle>
}

export const Input = forwardRef((Props:Props, ref:Ref<TextInput> | null) => {

    const {IconLeft,IconRight,title,iconLeftName,iconRightName,onIconLeftPress,onIconRightPress,backgroundColor,height,labelStyle,...rest} = Props;

    const calculateSizeWidth = () => {
        if(IconLeft && IconRight) {
            return "80%";
        }else if(IconLeft || IconRight) {
            return "85%";
        }else {
            return "100%";
        }
    }

    const calculateSizePadding = () => {
        if(IconLeft && IconRight) {
            return 12;
        }else if(IconLeft || IconRight) {
            return 12;
        }else {
            return 15;
        }
    }

    return (
        <>
            {title&&<Text style={[style.titleInput,labelStyle]}>{title}</Text>}
            <View style={[style.boxInput, {paddingLeft: calculateSizePadding(), paddingRight: calculateSizePadding(), height: height || 40, backgroundColor: backgroundColor || themes.colors.lightGray, borderColor: backgroundColor || themes.colors.lightGray}]}>
                {IconLeft && iconLeftName &&(
                    <TouchableOpacity onPress={onIconLeftPress} style={style.button}>
                        <IconLeft name={iconLeftName as any} size={24} color={themes.colors.gray} style={style.icon} />
                    </TouchableOpacity>
                )}
                <TextInput
                    style={[style.input, {width: calculateSizeWidth(), height: "100%"}]}
                    {...rest}
                />
                {IconRight && iconRightName &&(
                    <TouchableOpacity onPress={onIconRightPress} style={style.button}>
                        <IconRight name={iconRightName as any} size={24} color={themes.colors.gray} style={style.icon} />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
})