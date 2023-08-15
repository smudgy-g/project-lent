import { SetStateAction, useEffect, useState } from "react";
import { getUser } from "../../service/apiService";
import { User } from "../../types/types";


function Profile() {

  /* State Variables */

  const [userData, setUserData] = useState<User | null>(null)

  /* useEffect */

  useEffect(() => {
    getUser()
      .then((user) => setUserData(user))
      .catch((error) => console.log(error));
  }, []);

  /* Render Component */

  return (<>
    <div className="profile">
      <div>Name:</div>
      <div>{userData?.username}</div>
      <div>Email:</div>
      <div>{userData?.email}</div>
      <div>Address:</div>
      <div>{userData?.address?.streetName} {userData?.address?.streetNumber}</div>
      <div>{userData?.address?.postalCode} {userData?.address?.city}</div>
      <div>Credits:</div>
      <div>{userData?.credits}</div>
    </div>
      
  </>);
}

export default Profile;