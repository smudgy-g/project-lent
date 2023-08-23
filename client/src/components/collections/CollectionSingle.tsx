import { SetStateAction, useContext, useEffect, useState } from "react";
import { ActionButtonGroupData, Collection, Item } from "../../types/types";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCollection, getAllCollections, getAllItems, getItemsByCollection } from "../../service/apiService";
import ItemList from "./ItemList";

export default function CollectionSingle () {

  const [items, setItems] = useState<Item[] | null>(null);
  const [currentCollection, setCurrentCollection] = useState<Collection | undefined>();
  
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
        .then((items) => {
          setItems(items)})
        .catch((error) => console.log(error));
    }
  }, [collectionId]);

  useEffect(() => {
    getAllCollections()
      .then((result) => {
        const filteredCollection = result.filter((item) => item._id === collectionId);
        if (filteredCollection) {
          setCurrentCollection(filteredCollection[0]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Populate the Header component’s action button group
  useEffect(() => {
    const localActionButtonGroupData: ActionButtonGroupData = [
      [
      {
        title: 'Edit',
        action: () => {
          navigate(`/collection/edit/${collectionId}`);
        }
      },
      {
        type: 'add item',
        title: 'Add Item',
        action: () => {
          navigate(`/item/add/${collectionId}`);
        }
      },
      {
        title: 'Delete',
        action: async () => {
          await deleteCollection(collectionId!)
          navigate('/collections');
        }
      }
    ]
    ]
    setActionButtonGroupData(localActionButtonGroupData);
  }, []);

  /* Render Component */

  return (<>
    <div className="collection-single">
      {currentCollection &&
      <h1>Collection: {currentCollection!.name}</h1>
      }
      {items && <ItemList items={items} />}
    </div>
  </>)
}