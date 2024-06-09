import { PrettyChatWindow } from 'react-chat-engine-pretty';
import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const ChatsPage = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            try{
                const response = await fetch(`http://localhost:3001/auth/verify-token/${token}`);
                console.log(response.json());
                if(!response.ok){
                    throw new Error("Token verification failed");
                }
            } catch (error){
                localStorage.removeItem("token");
                navigate("/");
            }
        };

        verifyToken();
    }, [navigate, props.user]);
    

    return (
        <div className="background">
            <div className='chat-wrapper'>
                {/* <PrettyChatWindow
                    projectId={import.meta.env.VITE_CHAT_ENGINE_PROJECT_ID}
                    username={props.user.username}
                    secret={props.user.secret}
                /> */}
            </div>
        </div>
    );
}

export default ChatsPage