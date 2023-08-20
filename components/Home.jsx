import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ToastAndroid,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../Firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, addDoc, getDocs, query, where,doc, deleteDoc } from "firebase/firestore";
import UserAvatar from "react-native-user-avatar";

const Home = ({ navigation }) => {
    const [description, setDescription] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState("");
    const [tasks, setTasks] = useState([]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date.toLocaleDateString("en-US"));
        console.log(selectedDate);
        hideDatePicker();
    };

    const saveTasks = async () => {
        try {
            const docRef = await addDoc(collection(db, "tasks"), {
                UserID: userId,
                taskDescription: description,
                deadline: selectedDate,
            });
            ToastAndroid.show("Task Saced", ToastAndroid.SHORT);
            getTasksFromFirebase();
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const getTasksFromFirebase = async () => {
        const tasksArr = [];

        let dbRef = collection(db, "tasks");
        const querySnapshot = await getDocs(
            query(dbRef, where("UserID", "==", userId))
        );
        querySnapshot.forEach((doc) => {
            tasksArr.push({
                id: doc.id,
                data: doc.data(),
            });
        });
        setTasks(tasksArr);
    
    };

    const showTasks = (task) => {
        return (

            <View style={styles.card}>

                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Text style={{ color: "#0698ee" }}>Description</Text>

                    <Text style={{ width: 150 }}>{task.item.data.taskDescription}</Text>

                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Text style={{ color: "#0698ee" }}>Deadline</Text>
                    <Text>{task.item.data.deadline}</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.delButton} onPress={() => handleDelete(task.item.id)}>
                        <Icon name="trash" size={20} color="#ff3333" />
                    </TouchableOpacity>
                </View>
            </View>

        );
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "tasks", id));
            ToastAndroid.show("Task Deleted", ToastAndroid.SHORT);
            getTasksFromFirebase(); // Refresh the tasks list
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
                setUserName(user.displayName);
            } else {
                setUserId(null);
                setUserName("");
            }
        });
        getTasksFromFirebase();
    }, [tasks]);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.avatar}>
                    <UserAvatar size={30} name={userName} bgColor="#ff3333" />
                    <Text style={styles.title}>Hello, {userName}</Text>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        auth.signOut().then(() => {
                            navigation.replace("Login");
                        })
                    }
                    style={styles.button}
                >
                    <Text style={{ color: "#f3f2f2" }}>Logout</Text>
                </TouchableOpacity>
            </SafeAreaView>
            <View style={styles.mainContent}>
                <Text style={{ fontSize: 15 }}>Enter Task Description</Text>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="gray"
                    placeholder="Description"
                    onChangeText={setDescription}
                    value={description}
                    multiline={true}
                    underlineColorAndroid="transparent"
                />
                <View style={styles.dateStyle}>
                    <Text style={{ fontSize: 15 }}>Pick a deadline</Text>

                    <TouchableOpacity onPress={showDatePicker}>
                        <View
                            style={{
                                marginTop: 5,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Icon name="calendar" size={20} color="#0698ee" />
                            <Text>{selectedDate}</Text>
                        </View>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>

                <TouchableOpacity style={styles.addButton} onPress={saveTasks}>
                    <Text style={{ color: "#f3f2f2" }}>Add Task</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.displayContent}>
                <Text
                    style={{ fontSize: 20, marginVertical: 10, marginHorizontal: 10 }}
                >
                    Your Tasks
                </Text>
                {tasks.length > 0 ? (
                    <FlatList
                        showsVerticalScrollIndicator={true}
                        data={tasks}
                        renderItem={showTasks}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <Text>Add Tasks</Text>
                )}
            </View>
        </>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    avatar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "50%",
    },
    mainContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: 15,
        padding: 10,
        marginHorizontal: 5,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: "white",
        borderColor: "white",
        elevation: 4,
    },
    displayContent: {
        flex: 1,
        alignItems: "flex-start",
        padding: 10,
        marginVertical: 10,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: "white",
        borderColor: "white",
        elevation: 4,
        height: "50%",
    },
    title: {
        fontSize: 25,
        color: "#0698ee",
    },
    button: {
        alignItems: "center",
        padding: 7,
        borderRadius: 5,
        backgroundColor: "#0698ee",
    },
    delButton: {
        alignItems: "center",
        padding: 7,

    },
    input: {
        marginTop: 10,
        width: "100%",
        height: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
    },
    dateStyle: {
        marginVertical: 10,
    },

    addButton: {
        backgroundColor: "#0698ee",
        alignItems: "center",
        padding: 10,
        width: "100%",
        borderRadius: 5,
    },
    card: {
        marginVertical: 5,
        padding: 5,
        left: 'auto',
        backgroundColor: "#f3f2f2",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#f3f2f2",
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%'
    },

});
