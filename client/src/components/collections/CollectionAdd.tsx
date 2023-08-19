import { useContext, useEffect, useState } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate } from "react-router-dom";
import { getAllItems } from "../../service/apiService";
import { Item } from "../../types/types";
import ItemList from "./ItemList";

export default function CollectionAdd () {

  /* State Variables */

  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<Item[] | null>(null)
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();


  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setInputValue(event.target.value);
  };  

  function handleCheckboxChange(itemId: string){
    if(checkedItems.includes(itemId)) {
      setCheckedItems(checkedItems.filter((item) => item !== itemId))
    }
    else {
      setCheckedItems([...checkedItems, itemId])
    }
    console.log(checkedItems)

  }

  function handleSubmit() {
    // postCollection(name, itemIds)
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
    {items && items.map((item, index) => (
        <div key={item._id}>
          <label>
            <input
              type="checkbox"
              value={item._id}
              checked={checkedItems.includes(item._id!)}
              onChange={() => handleCheckboxChange(item._id!)}
            >
            </input>
            <div>{item.name}</div>
            <img src={item.img_url}/>
          </label>
        </div>
      ))}
    </div>
    <div>
      <button type="submit" className="button">Select Items</button>
    </div>
  </form>
  </>)
}