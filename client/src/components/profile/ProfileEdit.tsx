import { useEffect, useState, useContext } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { Address } from "../auth/Register";
import { putUser } from "../../service/apiService";
import { useNavigate } from 'react-router-dom';
import { getUser } from "../../service/apiService";

export interface ProfileEditData {
  username?: string | undefined;
  email?: string | undefined;
  address?: Address;
  newUser?: boolean;
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

  useEffect(() => {
    getUser()
      .then((user) => setProfileEditData(user))
      .catch((error) => console.log(error));
  }, []);


  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    // Access the properties of the nested address object,
    if (name === 'streetName' || name === 'streetNumber' || name === 'postalCode' || name === 'city') {
      setProfileEditData((prevProfileData) => ({
        ...prevProfileData,
        addres: {
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(profileEditData)
    await putUser(profileEditData)
    navigate('/profile')
  };

  /* Render Component */

  return (<>
    <div className="profile-edit">
      <form onSubmit={handleSubmit}>
        <label>
          <h4>Username:</h4>
          <input
            type="text"
            name="username"
            value={profileEditData.username}
            onChange={handleChange}
          />
        </label>

        <label>
          <h4>Email:</h4>
          <input
            type="text"
            name="email"
            value={profileEditData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          <h4>Street:</h4>
          <input
            type="text"
            name="streetName"
            value={profileEditData!.address!.streetName}
            onChange={handleChange}
          />
        </label>

        <label>
          <h4>Number:</h4>
          <input
            type="text"
            name="streetNumber"
            value={profileEditData!.address!.streetNumber}
            onChange={handleChange}
          />
        </label>

        <label>
          <h4>Postal Code:</h4>
          <input
            type="text"
            name="postalCode"
            value={profileEditData!.address!.postalCode}
            onChange={handleChange}
          />
        </label>

        <label>
          <h4>City:</h4>
          <input
            type="text"
            name="city"
            value={profileEditData!.address!.city}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="button styled full large"
          disabled={
            profileEditData.username === '' ||
            profileEditData.email === '' ||
            profileEditData!.address!.streetName === '' ||
            profileEditData!.address!.streetNumber === '' ||
            profileEditData!.address!.postalCode === '' ||
            profileEditData!.address!.city === ''
          }
        >Save Changes</button>
      </form>
    </div>

  </>);
}

export default ProfileEdit;