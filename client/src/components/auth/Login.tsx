import { useState, useContext, useEffect } from "react";
import { loginUser } from "../../service/apiService";
import { useSignIn } from 'react-auth-kit'
import { Link, useNavigate } from 'react-router-dom'
import { HeaderContext } from "../../contexts/HeaderContext";
import { HeaderContextProps } from "../../contexts/HeaderContext";

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
  const [error, setError] = useState<string>('');

  /* Hooks */

  const signIn = useSignIn();
  const navigate = useNavigate();
  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  /* Use Effects */

  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setLoginFormData((prevLoginFormData) => ({
      ...prevLoginFormData,
      [name]: value,
    }));
  };

  async function handleSubmit(event: React.FormEvent) {
    try {
      event.preventDefault();
      const response = await loginUser(loginFormData);

      // If the login attempt was successful,
      // use the token in the server response
      // to sign the user in, and redirect the user to the root,
      // otherwise show the error message
      if (response.token) {
        signIn({
          token: response.token,
          expiresIn: 60 * 60,
          tokenType: 'Bearer',
          authState: { _id: response.user._id }
        });
        navigate('/')
      } else {
        setError(response.message)
      }
    } catch (err) {
      console.log('Error:', err)
    }
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
              <button className="button" type="submit"
              disabled={
                loginFormData.username === '' ||
                loginFormData.password === ''
              }
              >Log In</button>
            </div>
          </form>
          <div>
            <p>Don’t have an account yet?</p>
            <Link to={'/register'}><button className="button">Register</button></Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;