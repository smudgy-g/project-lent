import { useContext, useEffect, useState } from "react";
import { Collection, Item } from "../../types/types";
import { ActionButtonGroupData, HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { getAllItems, getItemsByCollection } from "../../service/apiService";

export default function CollectionSingle () {

  const [items, setItems] = useState<Item[] | null>(null);

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();
  const { collectionId } = useParams();

  /* Use Effect */

  useEffect(() => {
    if (collectionId === 'all') {
      getAllItems()
        .then((items) => setItems(items))
        .catch((error) => console.log(error));
    }
    else {
      getItemsByCollection(collectionId!)
        .then((items) => setItems(items))
        .catch((error) => console.log(error));
    }
  }, []);

  // Populate the Header component’s action button group
  useEffect(() => {
    const localActionButtonGroupData: ActionButtonGroupData = [
      // {
      //   title: 'Edit Collection',
      //   action: () => {
      //     navigate('/collection/add');
      //   }
      // },
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
    <div className="collection-single">

    </div>
  </>)
}