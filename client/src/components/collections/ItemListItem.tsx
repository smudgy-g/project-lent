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
        <img key={item.id} src={item.img_url} alt=""/>
      <h2>{item.name}</h2>
    </div>
  </>);
}