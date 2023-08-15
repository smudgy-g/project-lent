import { useEffect, useState, useContext } from "react";
import { HeaderContext } from "../../contexts/HeaderContext";
import { HeaderContextProps } from "../../contexts/HeaderContext";
import { Address } from "../auth/Register";
import { putUser } from "../../service/apiService";
import { useNavigate } from 'react-router-dom';

export interface ProfileEditData {
  username: string;
  email: string;
  address: Address;
};

function ProfileEdit() {

  /* State Variables */

  const [profileEditData, setProfileEditData] = useState<ProfileEditData>({
    username: '',
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
  const navigate = useNavigate();
      
  /* Use Effects */

  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);


  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    // Access the properties of the nested address object,
    if (name === 'streetName' || name === 'streetNumber' || name === 'postalCode' || name === 'city') {
      setProfileEditData((prevProfileData) => ({
        ...prevProfileData,
        address: {
          ...prevProfileData.address,
          [name]: value
        }
      }))
    } 
    // Access the non-nested properties of the registerFormData object
    else {
      setProfileEditData((prevProfileData) => ({
        ...prevProfileData,
        [name]: value,
      }));
    };
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(profileEditData)
    putUser(profileEditData)
    navigate('/profile')
    setProfileEditData({
      username: '',
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

  return (<>
    <div className="profile">
    <form onSubmit={handleSubmit}>
            <div className="form-element">
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={profileEditData.username}
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
                  value={profileEditData.email}
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
                  value={profileEditData.address.streetName}
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
                  value={profileEditData.address.streetNumber}
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
                  value={profileEditData.address.postalCode}
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
                  value={profileEditData.address.city}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-element">
              <button type="submit"
              disabled={
                profileEditData.username === '' ||
                profileEditData.email === '' ||
                profileEditData.address.streetName === '' ||
                profileEditData.address.streetNumber === '' ||
                profileEditData.address.postalCode === '' ||
                profileEditData.address.city === ''
              }
              >Save Changes</button>
            </div>
          </form>
    </div>
      
  </>);
}

export default ProfileEdit;