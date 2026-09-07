import axios from "axios";

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;


export const getNearbyPlaces = async (latitude, longitude, radius = 1500) => {

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${API_KEY}`;
    return axios.get(url);

};