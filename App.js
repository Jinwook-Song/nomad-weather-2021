import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "8ab63e31b6ca6a84e4f0a055bdffc9a4";

// Icons
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [currentTemp, setCurrentTemp] = useState(null);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
    setCurrentTemp(json.current.temp);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      {/* City */}
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      {/* Current Temp */}
      <View style={styles.current}>
        {currentTemp !== null ? (
          <Text style={styles.currentTemp}>
            {parseFloat(currentTemp)?.toFixed(1)} ºC
          </Text>
        ) : (
          <Text></Text>
        )}
      </View>
      {/* 8 Days */}
      <ScrollView
        pagingEnabled
        horizontal
        indicatorStyle="white"
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View
            style={{
              ...styles.day,
              flex: 5,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <ActivityIndicator color="#dff9fb" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.min).toFixed(1)} ~ {""}
                </Text>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.max).toFixed(1)}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="#dff9fb"
                />
              </View>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a29bfe",
  },
  // City
  city: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "#dff9fb",
    fontSize: 50,
    fontWeight: "500",
  },
  // Current Temp
  current: {
    flex: 1,
    alignItems: "center",
  },
  currentTemp: {
    color: "#dff9fb",
    fontSize: 110,
    fontWeight: "600",
  },
  weather: {},
  // 8 days
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  date: {
    color: "#dff9fb",
    fontSize: 20,
    marginBottom: 10,
  },
  temp: {
    color: "#dff9fb",
    fontWeight: "600",
    fontSize: 70,
  },
  description: {
    color: "#dff9fb",
    fontSize: 60,
    marginBottom: 10,
    marginRight: 20,
  },
  tinyText: {
    color: "#dff9fb",
    fontSize: 20,
  },
});
