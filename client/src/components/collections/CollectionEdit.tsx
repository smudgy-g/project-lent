import { useContext, useEffect, useState } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { deleteItemFromCollection, getAllCollections, getAllItems, getItemsByCollection, postNewCollection } from "../../service/apiService";
import { Item, Collection} from "../../types/types";
import CheckList from "./CheckList";

export default function CollectionEdit () {

  /* State Variables */

  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<Item[] | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[] | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [currentCollection, setCurrentCollection] = useState<Collection[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [addToData, setAddToData] = useState<Collection>({
    name: '',
    items: [],
    _id: '',
  });


  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();
  const { collectionId } = useParams();


  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    // const { value } = event.target;
    setInputValue(event.target.value);
    console.log(inputValue, selectedItems)
  };  

  function handleClickRemove() {
    // console.log(inputValue, selectedItems)
    // deleteItemFromCollection(selectedItems, collectionId)
  }

  function handleToggle () {
    setIsOpen(!isOpen);
  }

  function handleClickAddToCollection(foreignCollectionId: string) {
    console.log(foreignCollectionId, selectedItems)

    // add selected Items to selected collections (selectedItems, collectionIdOFADDCOLLECTION)

    // navigate(`/collection/${collectionId}`)
  }

  function handleClickSave() {
    // change CollectionName
  }

  /* Use Effect */

  // Populate the Header component’s action button group
  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  useEffect(() => {
    getItemsByCollection(collectionId!)
      .then((items) => setItems(items))
      .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    getAllCollections()
      .then((collections) => {
        setCollections(
          collections.filter(
            (collection) =>
              collection._id !== "64e0cee12796345e05ff87fc" &&
              collection._id !== "64e0cee12796345e05ff87fa" &&
              collection._id !== "64e0cee12796345e05ff87fe" &&
              collection._id !== collectionId &&
              collection._id !== "64e0cee12796345e05ff8800"
          )
        );
        setCurrentCollection(collections.filter((collection) => collection._id === collectionId));
      })
      .catch((error) => console.log(error));
  }, []);

  /* Render Component */

  return (<>
  <form>
    {currentCollection[0] && (
        <label>
          Name:
          <input
            type="text"
            name="collectionName"
            value={currentCollection[0].name}
            onChange={handleChange}
          />
        </label>
      )}
    <div>
      <CheckList items={items!} setSelectedItems={setSelectedItems}/>
    </div>
  </form>
  <div className="button-group">
      <button className="button styled full large" onClick={handleClickRemove}>Remove</button>

      <div className="dropdown-group button styled full large">
        <button className="button styled full large" onClick={handleToggle}>Add to...</button>
          {isOpen && <div className="button-list-top">
          {collections.map((collection) => <button key={collection._id} className="button" onClick={() => handleClickAddToCollection(collection._id!)}>{collection.name!}</button>)}
          </div>}
    </div>

      <button className="button styled full large" onClick={handleClickSave}>Save</button>
    </div>
  </>)
}