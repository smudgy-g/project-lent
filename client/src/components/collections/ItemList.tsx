import { Link } from "react-router-dom";
import { Item } from "../../types/types"
import ItemListItem from "./ItemListItem";

/* Type Definition */

interface ItemListProps {
  items: Item[];
}

/* Component Definition */

export default function ItemList ({ items }: ItemListProps) {

  /* Render Component */

  return (<>
    <div className="collection-list">
      {items.map((item) => (
        <Link key={item.id} to={`/item/${item.id}`}>
          <ItemListItem item={item} />
        </Link>
      ))}
    </div>
  </>);
}