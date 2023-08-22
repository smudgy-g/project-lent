import { useContext, useEffect, useState } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { addItemsToCollections, changeCollectionName, deleteItemsFromCollection, getAllCollections, getAllItems, getItemsByCollection, postNewCollection } from "../../service/apiService";
import { Item, Collection} from "../../types/types";
import CheckList from "./CheckList";
import { ChangeEvent } from "react";

export default function CollectionEdit () {

  /* State Variables */

  const [items, setItems] = useState<Item[] | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedItems, setSelectedItems] = useState<string[] | null>(null)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [currentCollection, setCurrentCollection] = useState<Collection[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<Collection["name"]>('');
  const [newCollectionName, setNewCollectionName] = useState<Collection["name"]>('');


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
    if( isOpen) {
      console.log('selected Collections:', selectedCollections, 'selected Items:', selectedItems)
      addItemsToCollections(selectedItems!, selectedCollections!)
      navigate(`/collection/${collectionId}`)
    } else {
      setIsOpen(!isOpen);
    }
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


  useEffect(() => {
    setNewCollectionName(collectionName)
    console.log(newCollectionName)
  });

  /* Render Component */

  return (<>
    <form>
      {currentCollection[0] && (
          <label>
            Name:
            <input
              type="text"
              name="collectionName"
              value={collectionName}
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
        {collections.length > 0 &&

       
        <div className="dropdown-group button styled full large">
          <button className="button styled full large" onClick={handleToggle}>Add items to...</button>
            { isOpen && 
            <div className="button-list-top">

            <select id="collection" name="collection" multiple onChange={handleSelectChange}>
              {collections && collections.map((collection : Collection) => {
                return (<option key={collection._id} value={collection._id}>{collection.name}</option>)
              })}
            </select>

            </div>}
        </div>
        }
        <button className="button styled full large" onClick={handleClickSave}>Save Name</button>

    </div>
  </>)
}

          {/* {collections.map((collection) => <button key={collection._id} className="button" onClick={() => handleClickAddToCollection(collection._id!)}>{collection.name!}</button>)} */}
