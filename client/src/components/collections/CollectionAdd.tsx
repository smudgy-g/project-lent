import { useContext, useEffect, useState } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate } from "react-router-dom";
import { getAllItems, postNewCollection } from "../../service/apiService";
import { Item } from "../../types/types";
import CheckList from "./CheckList";

export default function CollectionAdd () {

  /* State Variables */

  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<Item[] | null>(null)
  const [newCollectionItems, setNewCollectionItems] = useState<string[] | null>(null)
 

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();


  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
    console.log(inputValue, newCollectionItems)
  };  

  function handleSubmit() {
    // postNewCollection(inputValue, newCollectionItems!)
    console.log(inputValue, newCollectionItems)
  }

  /* Use Effect */

  // Populate the Header component’s action button group
  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  useEffect(() => {
    getAllItems()
      .then((items) => setItems(items))
      .catch((error) => console.log(error))
  })

  /* Render Component */

  return (<>
  <form onSubmit={handleSubmit}>
    <div className="form-element">
      <label>
        Name:
        <input
          type="text"
          name="collectionName"
          value={inputValue}
          onChange={handleChange}
        />
      </label>
    </div>
    <div>
      <CheckList items={items!} setNewCollectionItems={setNewCollectionItems}/>
    </div>
    <div>
      <button type="submit" className="button styled full large">Select Items</button>
    </div>
  </form>
  </>)
}