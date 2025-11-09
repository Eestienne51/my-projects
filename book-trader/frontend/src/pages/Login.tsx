import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


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
                if (!usernameExists()){
                    await signUp(email, password);
                }
                else {
                    alert("Please use another username. This one is taken.")
                }
                setIsRegistering(false);
            }
            else{
                if (!usernameExists()){
                    await signIn(email, password);
                    sessionStorage.setItem("user", username);
                    navigate("/");
                }
                else{
                    
                }
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
        const response = await api.get(`http://http://localhost:8080/getUserBookListings?username=${username}`);
        return (response.status === 200);
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