import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Button, Text, View, TouchableOpacity } from 'react-native';
import Login from './components/Login';
import { NavigationContainer, DefaultTheme  } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from './components/SignUp';
import Home from './components/Home';
import { auth } from "./Firebase";

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f3f2f2',
  },
};

const Stack = createNativeStackNavigator();
const options = {
  headerStyle: { backgroundColor: "#0698ee" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  
};

export default function App({ navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer theme={AppTheme}>
          <Stack.Navigator screenOptions={options}>
            <Stack.Screen
              name="Login"
              options={{
                headerShown: false,
              }}
              component={Login}
            />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Home" 
              options={{
                headerShown: false,
                // headerRight: () => (
                //   <TouchableOpacity style={styles.button} onPress={() => auth.signOut().then(() => {
                //     navigation.replace("Login");
                //     })} >
                //     <Text style={styles.buttonText}>Log Out</Text>
                // </TouchableOpacity>
                // ),
              }}
              
              component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button:{
    borderWidth: 1,
    padding: 5,
    borderColor: 'white'
  },
  buttonText: {
    color:'white'
  }
});
