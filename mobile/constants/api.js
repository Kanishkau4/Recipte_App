import { Platform } from "react-native";

export const API_URL = Platform.OS === 'android'
    ? "https://recipe-app-api-1n9a.onrender.com/api"
    : "http://localhost:5000/api";