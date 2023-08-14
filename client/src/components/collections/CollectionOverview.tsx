import { useContext, useEffect, useState } from "react"
import { ActionButtonGroupData, HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext"
import { useNavigate } from "react-router-dom";
import { Collection } from "../../types/types";
import { getAllCollections } from "../../service/apiService";

export default function CollectionOverview () {

  const [collections, setCollections] = useState<Collection[] | null>(null);

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();

  /* Use Effect */

  useEffect(() => {
    getAllCollections()
      .then((collections) => setCollections(collections));
  }, []);

  useEffect(() => {
    const localActionButtonGroupData: ActionButtonGroupData = [
      {
        title: 'Add Collection',
        action: () => {
          navigate('/collection/add');
        }
      }
    ]

    setActionButtonGroupData(localActionButtonGroupData);
  }, []);

  /* Render Component */

  return (<>
    <div className="collection-overview">
      <h1>Collections</h1>
      {/* {collections?.map((collection: Collection) => <div>{collection.name}</div>)} */}
    </div>
  </>)
}