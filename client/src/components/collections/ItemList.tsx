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
      {items && items.map((item, index) => (
        <Link key={index} to={`/item/${item._id}`}>
          <ItemListItem item={item} />
        </Link>
      ))}
    </div>
  </>);
}