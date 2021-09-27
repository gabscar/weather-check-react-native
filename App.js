  
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location'
import GetLocation from 'react-native-get-location'

const BASE_API_KEY = '431418e1b338e897140df877824108ee';

const URL = 'https://api.openweathermap.org/data/2.5/weather?'
export default function App() {
  const [error, setError] = useState(null);
  const [latitude,setLatitude] = useState(null)
  const [wheater, setWheater] = useState([]);
  useEffect(() => {
   Load();
  
  }, [])

  async function Load(){
    try{
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Acess to location is needed')
        return
      }
      let location = await Location.getCurrentPositionAsync({});

      const { coords } = location;
      
     
      const { latitude, longitude } = coords;
      setLatitude(latitude)
      const wheatherURL = `${URL}lat=${latitude}&lon=${longitude}&appid=${BASE_API_KEY}`
      const response = await fetch(wheatherURL);
      const result = await response.json();
      
      
      
      
      if(response.ok) {
        setWheater(result)
      } else {
        setError(result.message)
      }

    }catch(error){
      setErrorMessage(error.message)
    }
  }
  if(wheater) {
    const { main } = wheater
    return (
      <View style={styles.container}>
        <Text>{latitude}</Text>
        <StatusBar style="auto" />
      </View>
    )
  }else if (error) {
    return (
      <View style={styles.container}>
          
          <Text style={{ textAlign: 'center' }}>{error}</Text>
          
      </View>
    )
  }
;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});