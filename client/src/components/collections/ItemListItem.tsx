import { Item } from "../../types/types"

/* Type Definition */

interface ItemListItemProps {
  item: Item;
}

/* Component Definition */

export default function ItemListItem ({ item }: ItemListItemProps) {

  /* Render Component */

  return (<>
    <div className="list-item">
      <div className="preview-container">
        <div key={item._id} className="item-preview" style={{backgroundImage: `url(${item.img_url})`}}></div>
      </div>
      <h2>{item.name}</h2>
    </div>
  </>);
}