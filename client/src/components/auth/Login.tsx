import { useState } from "react";
import { loginUser } from "../../service/apiService";

/* Type Definitions */

export interface LoginFormData {
  username: string;
  password: string;
};

function Login() {

  /* State Variables */

  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setLoginFormData((prevLoginFormData) => ({
      ...prevLoginFormData,
      [name]: value,
    }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(loginFormData)
    loginUser(loginFormData)
  };

  /* Render Component */

  return (
    <>
      <div className="login">
        <div className="form login">
          <form onSubmit={handleSubmit}>
            <div className="form-element">
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={loginFormData.username}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <label>
                Password:
                <input
                  type="text"
                  name="password"
                  value={loginFormData.password}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <button type="submit"
              disabled={
                loginFormData.username === '' ||
                loginFormData.password === '' 
              }
              >Log In</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;