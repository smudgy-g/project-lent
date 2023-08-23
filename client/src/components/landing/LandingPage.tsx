import { useContext, useEffect } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { ActionButtonGroupData } from "../../types/types";
import { useNavigate } from "react-router-dom";

export default function LandingPage () {
  const navigate= useNavigate();
  
  function handleClickLogin () {
    navigate('/login')
  }
  function handleClickRegister () {
    navigate('/register')
  }

  /* Render Component */

  return (<>
    <div className="landing-page">
      <img src="https://i.pinimg.com/564x/bf/ca/9e/bfca9ed0cedc8a309a9ebc80b019f6c9.jpg" style={{ height: "30%", animation: "rotateAnimation 5s infinite", borderRadius:"50%"}} ></img>
      <h3>Share More, Own Less — Welcome to the Future of Lending!</h3>
      <p>We're revolutionizing the way you use and share everyday items, <br></br> making ownership an option, not a necessity.</p>
      <button className="button styled large secondary full " onClick={handleClickLogin}>Get Started</button>
      <button className="button styled large alert full " onClick={handleClickRegister}>Register</button>
    </div>

  </>);
}