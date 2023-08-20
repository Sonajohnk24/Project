import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert  } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { auth } from "../Firebase";

const SignUp = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
     const signUpHandler = () => {
  
      if (!name || !email || !password) {
          // Handle missing input fields
          Alert.alert('Error', 'Please fill in all fields.');
          return;
        }
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // User created successfully
          updateProfile(userCredential.user, {
              displayName: name
              })
          const user = userCredential.user;
          console.log(user);
          navigation.navigate('Home');
        })
        .catch((error) => {
          let errorMessage = '';
  
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'The email address is already in use by another account.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'The email address is invalid.';
              break;
            case 'auth/weak-password':
              errorMessage = 'The password is too weak.';
              break;
            default:
              errorMessage = 'An error occurred while creating your account.';
          }
    
          Alert.alert('Error', errorMessage);
          console.log(error);
        });
     };
  
      return (
          <View style={styles.container}>
            <Text style={styles.heading}>
                Create a free account to access the <Text style={{color: '#0698ee'}}>TaskScribe</Text> features
            </Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Name"
              onChangeText={setName}
              value={name}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="gray"
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity style={styles.button} onPress={signUpHandler}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        );
      }
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        heading:{
            color: 'gray',
            marginBottom: 20,
            fontSize: 20,
            textAlign: 'center'
        },
      button: {
        backgroundColor: '#0698ee',
        alignItems: 'center',
         padding: 10,  
         width: '80%',
         borderRadius: 5,
         marginTop: 20,
         
    },
        buttonText: {
          color: '#f3f2f2',
        },
        input: {
          marginBottom: 20, 
          width: '80%', 
          height: 40, 
          borderWidth: 1, 
          borderColor: '#ccc', 
          padding: 10,
  
        }
      });
  
export default SignUp

