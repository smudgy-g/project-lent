import { Link } from "react-router-dom";
import { Item } from "../../types/types"
import ItemListItem from "./ItemListItem";
import { useEffect } from "react";

/* Type Definition */

interface ItemListProps {
  items: Item[];
}

/* Component Definition */

export default function ItemList ({ items }: ItemListProps) {

  useEffect(() => {
    console.log(items);
  }, [items])

  /* Render Component */

  return (<>
    <div className="collection-list">
      {items && items.map((item) => (
        <Link key={item._id} to={`/item/${item._id}`}>
          <ItemListItem item={item} />
        </Link>
      ))}
    </div>
  </>);
}