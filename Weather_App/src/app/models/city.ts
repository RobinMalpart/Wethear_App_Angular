export interface CityWeather {
    city: string;
    weather: string;
    temperature: number;
    feelsLike: number;
  }


// for database table
export interface Location {
  id: string;
  name: string;
  coordinateX: number;
  coordinateY: number;
}

export interface UserHistory {
  id: string;
  idUser: string;
  villeId: string;
  searchedAt: string;
}
