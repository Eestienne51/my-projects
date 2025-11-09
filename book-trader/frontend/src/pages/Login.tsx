import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { auth } from "../firebase/firebaseConfig";
import axios from "axios";

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");

    const { signIn, signUp, signInWithGoogle } = useAuth()!;
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6){
            setError("Password is too short. Please try again");
            return error;
        }
        try {
            setError("");
            setLoading(true);
            if (isRegistering){

                const usernameIsTaken = await usernameExists();

                if (usernameIsTaken){
                    setError("Username is taken. Please choose another one.")
                    return;
                }

                const user = await signUp(email, password);

                await addUsername(user.uid);

                alert("Sign-up was successful!");
                
                setIsRegistering(false);
            }
            else{
                const user = await signIn(email, password);

                const storedUsernames = await getUsersById(user.uid);

                if (!storedUsernames){
                    setError("No username found for this account. Please contact support.");
                    await auth.signOut(); 
                    return;
                }

                if (storedUsernames[0].username !== username){
                    console.log(storedUsernames)
                    console.log(username)
                    setError("Username does not match this account, please try again.")
                    await auth.signOut();
                    return;
                }

                sessionStorage.setItem("user", username);
                alert("Signed-in successfully!")
                navigate("/");

            }
        } catch(error: any){
            setError(error.message);
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    }

    const handleGoogleSignIn = async () => {
        try{
            setError("");
            setLoading(true);
            await signInWithGoogle();
            navigate("/")
        }
        catch(error: any){
            setError(error.message);
            console.error(error);
        } 
        finally {
            setLoading(false);
        }
    }

    const usernameExists = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/getUsername?username=${username}`);
            return (response.status === 200);
        } catch (error: any){
            if (error.response?.status === 404){
                return false;
            }
            console.error("Error while getting usernames", error)
        }
    }

    const getUsersById = async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/getUsernameById?userId=${userId}`);
            return response.data.usernames;
            
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error("Error while getting usernames", error)
        }
    }

    const addUsername = async (userId: string) => {
        try {
            const response = await axios.post("http://localhost:8080/addUsername", {
                username: username,
                userId: userId
            })
            console.log(response.data.message)
        } catch (error) {
            console.error("Error while adding username", error)
        }
    }


    return(
        <div className="page">
            <div className="login-box">
                <h1 className="sign-in-text">
                {isRegistering ? "Create Account" : "Sign In"}
                </h1>

            {error && <p style={{ color : "red"}}>{error}</p>}

            <form onSubmit={handleAuth} className="submit-form">
                <input
                    type="username"
                    placeholder="Username"
                    value={username}
                    disabled={loading}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-boxes"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    disabled={loading}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-boxes"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-boxes"
                    required
                />
                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? "Loading..." : isRegistering ? "Sign Up" : "Sign In"}
                </button>
            </form>

            <button
                onClick={handleGoogleSignIn}
                className="google-button"
                disabled={loading}
                >
                Sign in with Google
            </button>

            <p className="register-text">
                {isRegistering
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="register-button"
                    disabled={loading}
                >
                    {isRegistering ? "Sign in" : "Register"}
                </button>
            </p>
        </div>
    </div>
    )
}