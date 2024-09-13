import { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, Pressable, Alert } from 'react-native';
import { UserIcon, LockClosedIcon, PhoneIcon } from 'react-native-heroicons/outline';
import { useNavigation } from "@react-navigation/native";
import { API_URLS } from '../apiConfig'; // Import the API URLs

const SignupScreen = () => {
  const navigation = useNavigation();
  
  // State variables for form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Function to handle signup
  const handleSignup = async () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }

    try {
      const response = await fetch(API_URLS.registerUser, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          isDriver: false,  // Set isDriver to false
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        navigation.navigate('signIn');  // Navigate to SignIn screen after success
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/pngegg.png')} style={styles.imageStyle} />
        <Text style={styles.logoText}>
          Welcome back kindly sign in to access {"\n"} your account.
        </Text>
      </View>

      <View style={styles.formContainer}>
        {/* Full Name Input */}
        <View style={styles.inputGroup}>
          <UserIcon color="black" size={20} style={styles.sideIcon} />
          <TextInput 
            value={fullName} 
            onChangeText={(text) => setFullName(text)} 
            style={styles.input}
            placeholder="Full Name" 
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <UserIcon color="black" size={20} style={styles.sideIcon} />
          <TextInput 
            value={email} 
            onChangeText={(text) => setEmail(text)} 
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputGroup}>
          <PhoneIcon color="black" size={20} style={styles.sideIcon} />
          <TextInput 
            value={phone} 
            onChangeText={(text) => setPhone(text)} 
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <LockClosedIcon color="black" size={20} style={styles.sideIcon} />
          <TextInput 
            value={password} 
            onChangeText={(text) => setPassword(text)} 
            style={styles.input}
            placeholder="Password"
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.loginGroup}>
        <Text style={styles.resetPwd}>
          Click the link below to reset login credentials {"\n"} Forgot Password
        </Text>

        <TouchableOpacity style={styles.registerBtn} onPress={handleSignup}>
          <Text style={{ color: "#fff", fontSize: 16 }}>Sign Up</Text>
        </TouchableOpacity>

        <Pressable onPress={() => navigation.navigate('signIn')}>
          <Text style={styles.signTxt}>Already have an account? Sign In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  logoContainer: {
    width: "75%",
    height: "20%",
    display: "flex",
    flexDirection: "column",
    gap: "0.3%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoText: {
    textAlign: 'center',
    width: "95%",
    color: "#6E6D7A",
  },
  formContainer: {
    width: "100%",
    height: "40%", // Adjusted height to fit new inputs
    marginTop: "2%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputGroup: {
    backgroundColor: "#ECECEC",
    width: "85%",
    height: "18%", // Adjusted to make the input field taller
    borderRadius: 5,
    display: "flex",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
  },
  sideIcon: {
    marginLeft: "4%",
  },
  registerBtn: {
    width: "100%",
    height: "30%",
    backgroundColor: "#1C3530",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "90%",
    height: "90%",
    borderRadius: 10,
    fontSize: 18,
    marginLeft: "2%",
  },
  loginGroup: {
    position: 'absolute',
    width: "90%",
    marginBottom: 0,
    top: "70%",
    height: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  resetPwd: {
    color: "#6E6D7A",
    textAlign: "center",
  },
  signTxt: {
    color: "#1C3530",
    marginTop: 10,
  },
  imageStyle:{
    width:150,
    height:150
  },
});

export default SignupScreen;
