import { useState, useEffect, useContext} from "react";
import { registerUser } from "../../service/apiService";
import { useNavigate } from 'react-router-dom'
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";

/* Type Definitions */

export interface RegisterFormData {
  username: string;
  password: string;
  email: string;
  address: Address;
};

export interface Address {
  streetName: string | undefined;
  streetNumber: string | undefined;
  postalCode: string | undefined;
  city: string | undefined;
};

function Register() {

  const navigate = useNavigate()

  /* State Variables */

  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    username: '',
    password: '',
    email: '',
    address: {
      streetName: '',
      streetNumber: '',
      postalCode: '',
      city: '',
    },
  });

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  /* Use Effects */

  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    // Access the properties of the nested address object,
    if (name === 'streetName' || name === 'streetNumber' || name === 'postalCode' || name === 'city') {
      setRegisterFormData((prevRegisterFormData) => ({
        ...prevRegisterFormData,
        address: {
          ...prevRegisterFormData.address,
          [name]: value
        }
      }))
    }
    // Access the non-nested properties of the registerFormData object
    else {
      setRegisterFormData((prevRegisterFormData) => ({
        ...prevRegisterFormData,
        [name]: value,
      }));
    };
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(registerFormData);
    registerUser(registerFormData);
    navigate('/login')
    setRegisterFormData({
      username: '',
      password: '',
      email: '',
      address: {
        streetName: '',
        streetNumber: '',
        postalCode: '',
        city: '',
      },
    });
  };

  /* Render Component */

  return (
    <>
      <div className="register">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={registerFormData.username}
              onChange={handleChange}
            />
          </label>

          <label>
            Password:
            <input
              type="text"
              name="password"
              value={registerFormData.password}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              type="text"
              name="email"
              value={registerFormData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Street:
            <input
              type="text"
              name="streetName"
              value={registerFormData.address.streetName}
              onChange={handleChange}
            />
          </label>

          <label>
            Number:
            <input
              type="text"
              name="streetNumber"
              value={registerFormData.address.streetNumber}
              onChange={handleChange}
            />
          </label>

          <label>
            Postal Code:
            <input
              type="text"
              name="postalCode"
              value={registerFormData.address.postalCode}
              onChange={handleChange}
            />
          </label>

          <label>
            City:
            <input
              type="text"
              name="city"
              value={registerFormData.address.city}
              onChange={handleChange}
            />
          </label>

          <button
            className="button styled full large"
            type="submit"
            disabled={
              registerFormData.username === '' ||
              registerFormData.password === '' ||
              registerFormData.email === '' ||
              registerFormData.address.streetName === '' ||
              registerFormData.address.streetNumber === '' ||
              registerFormData.address.postalCode === '' ||
              registerFormData.address.city === ''
            }
          >Register</button>
        </form>
      </div>
    </>
  );
}

export default Register;