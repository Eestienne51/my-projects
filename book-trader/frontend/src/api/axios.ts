import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const api = axios.create({ baseURL: "http://localhost:8080"});

// Intercept every request and add the token
api.interceptors.request.use(async (config) => {
    // Get the current user
    const user = auth.currentUser;

    // If we have one
    if (user) {
        // Get the user token
        const token = await user.getIdToken();
        // Set the header to what we're looking for
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;