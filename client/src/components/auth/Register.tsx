import { useState } from "react";
import { registerUser } from "../../service/apiService";
import { useNavigate } from 'react-router-dom'
/* Type Definitions */

export interface RegisterFormData {
  username: string;
  password: string;
  email: string;
  address: Address;
};

export interface Address {
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
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
        <div className="form register">
          <form onSubmit={handleSubmit}>
            <div className="form-element">
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={registerFormData.username}
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
                  value={registerFormData.password}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <label>
                Email:
                <input
                  type="text"
                  name="email"
                  value={registerFormData.email}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <label>
                Street:
                <input
                  type="text"
                  name="streetName"
                  value={registerFormData.address.streetName}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <label>
                Number:
                <input
                  type="text"
                  name="streetNumber"
                  value={registerFormData.address.streetNumber}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <label>
                Postal Code:
                <input
                  type="text"
                  name="postalCode"
                  value={registerFormData.address.postalCode}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={registerFormData.address.city}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <button type="submit"
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;