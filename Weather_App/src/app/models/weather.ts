export interface CityWeather {
    city: string;
    weather: string;
    temperature: number;
    feelsLike: number;
    icon: string;
  }
export interface Location {
  id: string;
  city_name: string;
  latitude: number;
  longitude: number;
}

export interface UserHistory {
  id: string;
  user_id: string;
  location_id: string;
  consulted_at: string;
}
