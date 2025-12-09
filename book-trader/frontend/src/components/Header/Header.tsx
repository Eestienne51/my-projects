import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps{
    home?: boolean,
    trades?: boolean,
    showLogin?: boolean

}

export default function Header({home, trades, showLogin}: HeaderProps){
    const { currentUser, logout} = useAuth();
    const navigate = useNavigate();

    const handleAuthButton = async () => {
        if (currentUser) {
            await logout();
        }
        else {
            navigate("/login");
        }
    }

    const handleTradeButton = () => {
        if (currentUser) {
            navigate("/trades");
        }
        else {
            alert("Please sign-in to access your trades")
        }
    }


    return (
        <div className="header-container">

            <h2 className="company-name" onClick={() => navigate("/")}>
                Rebound
            </h2>

            <div className="nav-buttons">

                <div 
                    className={`nav-button ${home ? "active" : ""}`} 
                    onClick={() => navigate("/")}
                >
                    <h2>Home</h2>
                </div>

                <div 
                    className={`nav-button ${trades ? "active" : ""}`} 
                    onClick={handleTradeButton}
                >
                    <h2>Trades</h2>
                </div>
            </div>

            <div className="auth-container">
                {showLogin && (
                    <button className="auth-button" onClick={handleAuthButton}>
                        {currentUser ? "Logout" : "Login"}
                    </button>
                )}
            </div>

        </div>
    )
}