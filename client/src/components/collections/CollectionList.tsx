import { Link } from "react-router-dom";
import { Collection } from "../../types/types"
import CollectionListItem from "./CollectionListItem";

/* Type Definition */

interface CollectionListProps {
  collections: Collection[];
}

/* Component Definition */

export default function CollectionList ({ collections }: CollectionListProps) {

  /* Render Component */

  return (<>
    <div className="collection-list">
      {collections.map((collection) => (
        <Link key={collection._id} to={`/collection/${collection._id}`}>
          <CollectionListItem key={collection._id} collection={collection} />
        </Link>
      ))}
    </div>
  </>);
}