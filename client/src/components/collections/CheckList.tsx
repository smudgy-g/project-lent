import { Link } from "react-router-dom";
import { Item } from "../../types/types"
import { useEffect, useState } from "react";
/* Type Definition */

interface CheckListProps {
  items: Item[];
  setNewCollectionItems: React.Dispatch<React.SetStateAction<string[] | null>>
}

/* Component Definition */

export default function CheckList({ items, setNewCollectionItems }: CheckListProps) {
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
    setNewCollectionItems(checkedItems);
    console.log(checkedItems) // Log the array of items
  }, [checkedItems])


  return (
    <>
      <div className="collection-list">
        {items &&
          items.map((item) => (
            <div key={item._id}>
              <label>
                <input
                  type="checkbox"
                  value={item._id}
                  // checked={checkedItems.includes(item._id!)}
                  onChange={() => handleCheckboxChange(item._id!)}
                />
                <div>{item.name}</div>
                <img src={item.img_url} alt={item.name} />
              </label>
            </div>
          ))}
      </div>
    </>
  );
}

    // {/* {items && items.map((item, index) => (
    //     <Link key={index} to={`/item/${item._id}`}>
    //       <ItemListItem item={item} />
    //     </Link>
    //   ))} */}