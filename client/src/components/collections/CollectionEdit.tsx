import { useContext, useEffect, useState } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { addItemsToCollections, changeCollectionName, deleteItemsFromCollection, getAllCollections, getItemsByCollection } from "../../service/apiService";
import { Item, Collection} from "../../types/types";
import CheckList from "./CheckList";
import { ChangeEvent } from "react";

export default function CollectionEdit () {

  const [items, setItems] = useState<Item[] | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedItems, setSelectedItems] = useState<string[] | null>(null)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [currentCollection, setCurrentCollection] = useState<Collection[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<Collection["name"]>('');
  const [newCollectionName, setNewCollectionName] = useState<Collection["name"]>('');

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();
  const { collectionId } = useParams();

  // Initialize the header
  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  // Get all items of the collection using the API service
  useEffect(() => {
    getItemsByCollection(collectionId!)
      .then((items) => setItems(items))
      .catch((error) => console.log(error))
  }, [])

  // Get all collections using the API service, find the current collection,
  // and set it as the currentCollection state variables value
  useEffect(() => {
    getAllCollections()
      .then((collections) => {
        setCollections(
          collections.filter(
            (collection) =>
              collection.name !== "All" &&
              collection.name !== "Borrowed" &&
              collection.name !== "Lent Out" &&
              collection._id !== collectionId &&
              collection.name !== "Reserved"
          )
        );
        setCurrentCollection(collections.filter((collection) => collection._id === collectionId));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (currentCollection[0]) {
      setCollectionName(currentCollection[0].name!)
    }
  }, [currentCollection]);

  /* Handler Functions */

  // Change Collection Name
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setCollectionName(event.target.value);
  };

  function handleClickSave() {
    console.log(newCollectionName, collectionId)
    changeCollectionName(newCollectionName!, collectionId!)
    navigate(`/collection/${collectionId}`)
  }

  // Remove Items
  async function handleClickRemove() {
    console.log(selectedItems, collectionId)
    await deleteItemsFromCollection(selectedItems!, collectionId!)
    navigate(`/collection/${collectionId}`)
  }

  // Add Items to another collection
  function handleSelectChange (event: ChangeEvent<HTMLSelectElement>) {
    const { options } = event.target;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value)
      }
    }
    setSelectedCollections(selectedValues);
  }

  function handleToggle () {
    if(isOpen) {
      console.log('selected Collections:', selectedCollections, 'selected Items:', selectedItems)
      addItemsToCollections(selectedItems!, selectedCollections!)
      navigate(`/collection/${collectionId}`)
    } else {
      setIsOpen(!isOpen);
    }
  }

  /* Render Component */

  return (<>
    <div className="collection-edit">
      <form>
        {currentCollection[0] && (
          <input
            type="text"
            name="collectionName"
            value={collectionName}
            onChange={handleChange}
          />
        )}
        <CheckList items={items!} setSelectedItems={setSelectedItems}/>
      </form>
      <div className="button-stack end">
        <div className="button-group">
          {(selectedItems && selectedItems.length > 0) && (<>
            <button className="button styled secondary full large" onClick={handleClickRemove}>Remove</button>

            {(collections.length > 0) && (
              <div className="dropdown-group button styled full large">
                <button className="button styled full large" onClick={handleToggle}>{!isOpen ? 'Add to...': 'Confirm'}</button>
                  { isOpen && (
                    <select className="select-list" id="collection" name="collection" multiple onChange={handleSelectChange}>
                      {collections && collections.map((collection : Collection) => (
                        <option key={collection._id} value={collection._id}>{collection.name}</option>
                      ))}
                    </select>
                  )}
              </div>
            )}
          </>)}
        </div>
        {(currentCollection[0] && currentCollection[0].name !== collectionName) && <div className="button-group">
          <button className="button styled full large" onClick={handleClickSave}>Save</button>
        </div>}

      </div>
    </div>
  </>)
}