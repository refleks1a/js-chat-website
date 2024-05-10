import axios from "axios";
import { useState } from "react";
import {useNavigate} from 'react-router-dom';

const AuthPage = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || !password) {
            setError('Username and password are required');
            return false;
        }
        setError("");
        return true;
    };

    const onSubmit =  async (e) => {
        e.preventDefault();

        if(!validateForm()){
            return;
        }
        setLoading(true);

        const formDetails = new URLSearchParams();
        formDetails.append ('username', username);
        formDetails.append ('password', password);
        
        try{
            const response = await fetch('http://localhost:3001/auth/token',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formDetails,
                }); 
            setLoading(false);

            if(response.ok){
                const data = await response.json();
                localStorage.setItem('token',data.access_token);
                const user = await fetch("http://localhost:3001/auth/verify-token/"+data.access_token,
                    {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                    }
                )
                const user_data = await user.json();
                if(user_data.message == "Token is valid"){
                    axios.post(
                        'http://localhost:3001/authenticate',
                        { username: username }
                    )
                    props.onAuth({ username: username, secret: username });
                    navigate('chat/');
                }
                
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Authentication failed!');
            }

        }catch(error){
            setLoading (false);
            setError('An error occurred. Please try again later.');
        }
        
    }

    return (
        <div className="background">
            <form onSubmit={onSubmit} className="form-card">
                <div className="form-title">
                    Welcome 👋
                </div>

                <div className="form-subtitle">
                    Set a username to get started
                </div>

                <div className="auth">
                    <div className="auth-label">Username</div>

                    <input className="auth-input" name="username" 
                    value={username} onChange={(e) => setUsername(e.target.value)}/>

                    <input className="auth-input" name="password" type="password" 
                    value={password} onChange={(e) => setPassword(e.target.value)}/>

                    <button className="auth-button" type="submit">
                        {loading? 'Logging in...' : 'Login'}
                    </button>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </form>
        </div>
    );
}

export default AuthPage