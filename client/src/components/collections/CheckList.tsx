import { Item } from "../../types/types"
import { useEffect, useState } from "react";
import ItemListItem from "./ItemListItem";
/* Type Definition */

interface CheckListProps {
  items: Item[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[] | null>>
}

/* Component Definition */

export default function CheckList({ items, setSelectedItems }: CheckListProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  function handleCheckboxChange(itemId: string) {
    if (checkedItems.includes(itemId)) {
      // If the item ID is already in the array, remove it
      setCheckedItems(checkedItems.filter((id) => id !== itemId));
    } else {
      // If the item ID is not in the array, add it
      setCheckedItems([...checkedItems, itemId]);
    }
  }

  useEffect(() => {
    setSelectedItems(checkedItems);
    console.log(checkedItems) // Log the array of items
  }, [checkedItems])


  return (
    <>
      <div className="collection-list">
        {items &&
          items.map((item, index) => (
            <label key={index}>
              <input
                className="hide"
                type="checkbox"
                value={item._id}
                onChange={() => handleCheckboxChange(item._id!)}
              />
              <ItemListItem item={item} />
            </label>
          ))}
      </div>
    </>
  );
}
