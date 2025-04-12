import { SecureStorage } from "@/class/SecureStorage";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/Header";
import {RootView} from "@/components/RootView";
import { Row } from "@/components/ui/Row";
import { Alert } from "@/components/Themed/Alert";
import { ThemedText } from "@/components/Themed/ThemedText";
import { ThemedTextInput } from "@/components/Themed/ThemedTextInput";
import { Config } from "@/constants/Config";

import { useThemeColor } from "@/hooks/color/useThemeColor";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Redirect, router, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function Login() {
    const colors = useThemeColor()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [msgList, setMsgList] = useState<string[]>([])

    const router = useRouter()
    const authentification = () => {
        const isFormValid = () => {
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return reg.test(email)
        }
        if (isFormValid()) {
            const data = useFetchQuery('/login', {
                method: 'POST',
                body: {
                    email: email,
                    password: password
                }
            })
            data.then(r => {
                console.log(r)
                router.replace("/home")
                SecureStorage.set('user_session', {
                    username: 'hello',
                    email: email,
                    token: r.jwt,
                    role: 'admin'
                })
            }).catch(e => {
                setMsgList([...msgList, e.message])
            })
        } else {
            setMsgList([...msgList, 'Invalid email address'])
        }
    }

    return <RootView>
        <View>
            <Header title="login" />
            <View style={styles.body}>
                <View>
                    <FlatList data={msgList}
                        scrollEnabled={false}
                        renderItem={(e) => <Alert type="danger">{e.item}</Alert>}
                    />
                </View>

                <Card style={styles.card}>
                    <ThemedText variant="h2" style={styles.title}>Login Form</ThemedText>

                    <View style={styles.inputView}>
                        <ThemedText variant="h3" style={[styles.label]}>Email</ThemedText>
                        <ThemedTextInput
                            style={[styles.input, { backgroundColor: colors.gray200 }]}
                            textContentType="username"
                            onChange={(email) => setEmail(email)}
                            value={email}

                            placeHolder="Entrer your email ..." />
                    </View>

                    <View style={styles.inputView}>
                        <ThemedText variant="h3" style={[styles.label]}>Password</ThemedText>
                        <View>
                            <ThemedTextInput
                                style={[styles.input, { backgroundColor: colors.gray200 }]}
                                textContentType="password"
                                placeHolder="Entrer your password ..."
                                secureTextEntry={!passwordVisible}
                                onChange={(password) => setPassword(password)}
                                value={password}
                            />
                            <Pressable
                                style={styles.icon}
                                onPress={() => setPasswordVisible(!passwordVisible)}>
                                <FontAwesome name={passwordVisible ? "eye" : "eye-slash"} size={24} color={colors.gray800} />
                            </Pressable>
                        </View>
                        <TouchableOpacity style={[styles.forgot_button]}>
                            <ThemedText variant="link">Forgot Password?</ThemedText>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.tint }]} onPress={authentification}>
                        <ThemedText variant="h3">Login</ThemedText>
                    </TouchableOpacity>
                </Card>
            </View>
        </View>
    </RootView>
}


const styles = StyleSheet.create({
    card: {
        paddingVertical: 32,
        paddingHorizontal: "20%"
    },
    forgot_button: {
        alignSelf: "flex-end",
    },
    title: {
        marginBottom: 8,
        alignSelf: "center"
    },
    label: {
        alignSelf: "baseline",
        marginBlockEnd: 8
        // marginVertical: 20,
    },
    input: {
        borderRadius: 8,
        width: "100%",
        height: 40,
        alignItems: "center",
        // paddingHorizontal: 8,
        // marginBlockEnd: 12
    },
    inputView: {
        // position: "relative",
        paddingVertical: 16,
        // gap: 8
    },
    loginBtn: {
        width: "100%",
        borderRadius: 8,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        position: "absolute",
        top: "15%",
        right: 10
    },

    body: {
        // marginVertical: 60,
        display: "flex",
        justifyContent: "center",
        // height: "80%",
        // borderBlockColor: "red",
        // borderColor: "red",
        // borderWidth: 4,
        // borderStyle: "solid"
    },
})