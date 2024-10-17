import express from "express"
import axios from "axios"
import { configDotenv } from "dotenv"
import mongoose from "mongoose"

configDotenv()

const app = express()
const city = "London"


mongoose.connect('mongodb://127.0.0.1:27017/weatherDB')
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));


const weatherSchema = new mongoose.Schema({
    temp: Number,       
    feels_like: Number,
    temp_min: Number,  
    temp_max: Number,  
    pressure: Number,    
    humidity: Number,      
    sea_level: String,   
    grnd_level: String
});


// Create a Mongoose model
const Weather = mongoose.model('Weatherkjsndfjnsdf', weatherSchema);

// API route to get weather data and save it to MongoDB
app.get('/save-weather', async (req, res) => {
  try {
    const apiKey = process.env.WEATHER_API;
    const city = req.query.city;
    
    // Check if city is provided in the query
    if (!city) {
      return res.status(400).json({ error: 'Please provide a city name' });
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    // Fetch weather data
    const response = await axios.get(weatherUrl);
    
    // Extract the 'weather' data from the response
    const weatherData = response.data.main; // Extract only the first weather object
    console.log(weatherData);
    

    // Create a new weather document from the fetched data
    const newWeather = new Weather({
        temp: weatherData.temp,       
        feels_like: weatherData.feels_like,
        temp_min: weatherData.temp_min,  
        temp_max: weatherData.temp_max,  
        pressure: weatherData.pressure,    
        humidity: weatherData.humidity,      
        sea_level: weatherData.sea_level,   
        grnd_level: weatherData.grnd_level 
    });

    // Save the weather data to MongoDB
    await newWeather.save();

    res.json({
      message: 'Weather data saved successfully!',
      weatherData: newWeather
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch or save weather data' });
  }
});


// const result = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API}`)
// .then((op) => {
//     console.log(op.data.main)
// })

app.listen(3000, (req, res) => {
    console.log("Server running on port 3000")
})


