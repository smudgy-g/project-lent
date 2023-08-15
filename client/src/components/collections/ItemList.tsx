import { Link } from "react-router-dom";
import { Item } from "../../types/types"
import { useEffect } from "react";
import ItemListItem from "./ItemListItem";

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
      {items.map((item) => (
        <Link key={item.id} to={`/collection/${item.id}`}>
          <ItemListItem key={item.id} item={item} />
        </Link>
      ))}
    </div>
  </>);
}