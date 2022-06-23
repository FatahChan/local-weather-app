import React from 'react';
import axios from "axios";
import "./App.css"
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};


function error(err: any) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

class App extends React.Component<any, any>{
  constructor(props: object) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      location: null,
      temp: null,
      celsius:true,
      weather: null,
      weather_icon: null
    }
    this.toggleTemp = this.toggleTemp.bind(this);
  }

  getLocation(){
    navigator.geolocation.getCurrentPosition((pos)=>{
      axios.get(`https://weather-proxy.freecodecamp.rocks/api/current?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
          .then((res) => {
            console.log(res.data.weather[0].icon);
            this.setState({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              location: `${res.data.name}, ${res.data.sys.country}`,
              temp: res.data.main.temp.toPrecision(2),
              weather: res.data.weather[0].main,
              weather_icon: res.data.weather[0].icon
            })
          })
    }, error, options);
  }
  componentDidMount() {
    this.getLocation()
  }
  toggleTemp(){
    if(this.state.celsius){
      this.setState({
        celsius: false,
        //(0°C × 9/5) + 32 = 32°F
        temp: ((this.state.temp * 9/5) + 32).toPrecision(2)
      })
    }else{
      this.setState({
        celsius: true,
        //(32°F − 32) × 5/9 = 0°C
        temp: ((this.state.temp - 32) * (5/9)).toPrecision(2)
      })
    }
  }
  render() {
    return (
        <div className="app">
          <h1 className="app-name"> Weather App</h1>
          <p className="location">{this.state.location}</p>
          <p className="temp" onClick={this.toggleTemp}>{this.state.temp} {this.state.celsius? <span>&#8451;</span> : <span>&#8457;</span>}</p>
          <p className="weather">{this.state.weather}</p>
          <img className="weather-icon" src={this.state.weather_icon} alt={this.state.weather}/>
        </div>
    )
  }
}

export default App;
