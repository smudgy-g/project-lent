import { Collection } from "../../types/types"

/* Type Definition */

interface CollectionListItemProps {
  collection: Collection;
}

/* Component Definition */

export default function CollectionListItem ({ collection }: CollectionListItemProps) {

  /* Render Component */

  return (<>
    <div className="list-item">
      <div className="preview-container"></div>
      {collection.items.map((item) => (
        // <div key={item.id} className="item-preview" style={{backgroundImage: item.img_url}}></div>
        <img key={item.id} src={item.img_url} alt=""/>
      ))}
      <h2>{collection.name}</h2>
    </div>
  </>);
}