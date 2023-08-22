import { useEffect, useState, useContext } from "react";
import { deleteUser, getUser } from "../../service/apiService";
import { ActionButtonGroupData, User } from "../../types/types";
import { HeaderContext } from "../../contexts/HeaderContext";
import { useNavigate} from 'react-router-dom'
import { HeaderContextProps } from "../../contexts/HeaderContext";
import { useSignOut } from 'react-auth-kit'
import useHistory from "../navigation/useHistory";


function Profile() {

  /* State Variables */

  const [userData, setUserData] = useState<User | null>(null)

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();
  const signOut = useSignOut();


  /* Use Effect */

  useEffect(() => {
    getUser()
      .then((user) => setUserData(user))
      .catch((error) => console.log(error));
  }, []);

  // Populate the Header component’s action button group
  useEffect(() => {
    const localActionButtonGroupData: ActionButtonGroupData = [
      [
        {
          title: 'Edit Profile',
          action: () => {
            navigate('/profile/edit');
          }
        },
        {
          title: 'Delete Profile',
          action: () => {
            deleteUser();
            navigate('/register');
          }
        },
        {
          title: 'Logout',
          action: () => {
            signOut()
            navigate('/login');
          }
        }
      ]
    ]
    setActionButtonGroupData(localActionButtonGroupData);
  }, []);

  /* Render Component */

  return (<>

    <div className="profile">
      <h1>{userData?.username}</h1>
      <div>Email: {userData?.email}</div>
      <div>Address:
        <div>{userData?.address?.streetName} {userData?.address?.streetNumber}</div>
        <div>{userData?.address?.postalCode} {userData?.address?.city}</div>
      </div>
      <div>Credits: {userData?.credits} ¢</div>
    </div>
  </>);
}

export default Profile;