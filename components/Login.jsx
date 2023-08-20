import { StyleSheet,TextInput, Text, View, TouchableOpacity } from 'react-native'
import React,  { useState, useEffect } from 'react'
import { auth } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace("Home");
            }
            else {
                navigation.navigate('Login');
              }
        });
        return unsubscribe;
    }, [navigation]);
  
    
    const LoginHandler = () => {
        console.log("login pressed")
        signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            if (error.code === "auth/wrong-password") {
            alert("Incorrect password. Please try again.");
          } else {
            alert("Password/Username Missing.");
          }
    })
};
  return (
    <View style={styles.container}>
        <Text></Text>
      
        <Text style={{ color: "#0698ee", fontSize: 30, }}>TaskScribe</Text>
        <Text style={{marginBottom: 20, color: "gray",textAlign:'center', width:'80%' }}>
        A powerful and intuitive task manager app designed to streamline your productivity. 
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="gray"
          onChangeText={text => setEmail(text)}
          value={email}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="gray"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={LoginHandler} style={styles.button}>
          <Text style={{ color: '#f3f2f2'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.button}>
          <Text style  ={{ color: '#f3f2f2'}}>Sign Up</Text>
        </TouchableOpacity>
      
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 200,
    },
    button: {
        backgroundColor: '#0698ee',
        alignItems: 'center',
        padding: 10,  
        width: '80%',
        borderRadius: 5,
        marginTop: 20,
        
        
    },
    textInput: {
        marginBottom: 20, 
        width: '80%', 
        height: 40, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 10,
        fontStyle: 'italic'
      }
})