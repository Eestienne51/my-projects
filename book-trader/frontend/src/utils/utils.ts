import api from "../api/axios";


export const getUsername = async (userId: string): Promise<string | null> => {
    try {
        const response = await api.get(`http://localhost:8080/getUsernameById?userId=${userId}`);
        console.log(response.data.usernames[0].username, "username");
        return response.data.usernames[0].username;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error("Error while getting usernames", error);
        return null;
    }
}