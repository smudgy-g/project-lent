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
      <div className="preview-container"></div>
        <div key={item.id} className="item-preview" style={{backgroundImage: item.img_url}}></div>
      <h2>{item.name}</h2>
    </div>
  </>);
}