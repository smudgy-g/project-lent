import { useContext, useEffect, useState } from "react"
import { ActionButtonGroupData, HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext"
import { useNavigate } from "react-router-dom";
import { Collection } from "../../types/types";
import { getAllCollections } from "../../service/apiService";
import CollectionList from "./CollectionList";

export default function CollectionOverview () {

  const [collections, setCollections] = useState<Collection[] | null>(null);

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();

  /* Use Effect */

  useEffect(() => {
    getAllCollections()
      .then((collections) => setCollections(collections))
      .catch((error) => console.log(error));
  }, []);

  // Populate the Header component’s action button group
  useEffect(() => {
    const localActionButtonGroupData: ActionButtonGroupData = [
      {
        type: 'add',
        title: 'Add Collection',
        action: () => {
          navigate('/collection/add');
        }
      },
      {
        type: 'add',
        title: '',
        action: () => {
          navigate('/item/add');
        }
      }
    ]
    setActionButtonGroupData(localActionButtonGroupData);
  }, []);

  /* Render Component */

  return (<>
    <div className="collection-overview">
      <h1>Collections</h1>
      {collections && <CollectionList collections={collections} />}
    </div>
  </>)
}