import { Link } from "react-router-dom";
import { Collection } from "../../types/types"
import CollectionListItem from "./CollectionListItem";
import { useEffect } from "react";

/* Type Definition */

interface CollectionListProps {
  collections: Collection[];
}

/* Component Definition */

export default function CollectionList ({ collections }: CollectionListProps) {

  useEffect(() => {
    console.log(collections);
  }, [collections])

  /* Render Component */

  return (<>
    <div className="collection-list">
      {collections.map((collection) => (
        <Link key={collection.id} to={`/collection/${collection.id}`}>
          <CollectionListItem key={collection.id} collection={collection} />
        </Link>
      ))}
    </div>
  </>);
}