
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location'
import WheatherInfo from './components/WheatherInfo';
import ReloadIcon from './components/ReloadIcon';
import Picker from './components/Picker';
import WeatherDetails from './components/WeatherDetails';

const BASE_API_KEY = '431418e1b338e897140df877824108ee';

const URL = 'https://api.openweathermap.org/data/2.5/weather?'
export default function App() {
  const [error, setError] = useState(null)
  const [currentWeather, setWheater] = useState([])
  const [units, setUnits] = useState('metric')
  useEffect(() => {
    Load()
  }, [units])

  const Load = async() => {
    try{
      let { status } = await Location.requestBackgroundPermissionsAsync()

      if (status !== 'granted') {
        setError('Acess to location is needed')
        return
      }
      const location = await Location.getCurrentPositionAsync( {  accuracy: Location.Accuracy.High })
      const { latitude, longitude } = location.coords
      const wheatherURL = `${URL}lat=${latitude}&lon=${longitude}&appid=${BASE_API_KEY}&units=${units}`
      const response = await fetch(wheatherURL)
      const result = await response.json()
      if(response.ok) {
        setWheater(result)
      } else {
        setError(result.message)
      }
    }catch(error){
      setError(error.message)
    }
  }
  if(currentWeather !== undefined) {
    const { weather, name } = currentWeather
      return (
        <View style={styles.container}>      
          <StatusBar style="auto" />
          <View style={styles.main}>
          <Picker unitSystem={units} setUnits={setUnits}/>
            <ReloadIcon load={Load}/>
            <WheatherInfo currentWeather={currentWeather} weather={weather} name={name}/>
            <WeatherDetails currentWeather={currentWeather} metricSystem={units}/>
          </View>

        </View>
      )
  }else if (error){
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>{errorMessage}</Text>
                <StatusBar style="auto" />
            </View>
  }else{
    return (
      <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
          <StatusBar style="auto" />
      </View>
    )
  }
;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    flex: 1
  }
});
