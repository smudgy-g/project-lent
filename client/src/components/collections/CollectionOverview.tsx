import { useContext, useEffect, useState } from "react"
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext"
import { Link, useNavigate } from "react-router-dom";
import { ActionButtonGroupData, Collection } from "../../types/types";
import { getAllCollections } from "../../service/apiService";
import CollectionList from "./CollectionList";

export default function CollectionOverview () {

  const [collections, setCollections] = useState<Collection[] | null>(null);

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();

  /* Use Effect */

  useEffect(() => {
    getAllCollections()
      .then((collections) => setCollections(collections))
      .catch((error) => console.log(error));
  }, []);

  // Populate the Header component’s action button group
  useEffect(() => {
    const localActionButtonGroupData: ActionButtonGroupData = [
      {
        type: 'add collection',
        title: 'Add Collection',
        action: () => {
          navigate('/collection/add');
        }
      },
      {
        type: 'profile',
        title: '',
        action: () => {
          navigate('/profile');
        }
      },
    ]
    setActionButtonGroupData(localActionButtonGroupData);
  }, []);

  /* Render Component */

  return (<>
    <div className="collection-overview">
      {collections && (<>
        <div className="static-collections">
          {collections
            .filter((collection) => (
              collection.name?.toLowerCase() === 'all'
              || collection.name?.toLowerCase() === 'lent out'
              || collection.name?.toLowerCase() === 'reserved'
              || collection.name?.toLowerCase() === 'borrowed'
            ))
            .map((collection, index) => (<>
              {collection.items && collection.items[0] && (
                <Link to={`/collection/${collection._id}`} key={index}>
                  <div className="static-collection-preview">
                    <div
                      className="static-collection-image"
                      style={{backgroundImage: `url(${collection.items[0].img_url})`}}>
                    </div>
                    <h2>{collection.name}</h2>
                  </div>
                </Link>
              )}
              {collection.items && !collection.items[0] && (
                <div className="static-collection-preview deactivated" key={index}>
                  <div className="static-collection-image deactivated"></div>
                  <h2>{collection.name}</h2>
                </div>
              )}
            </>))
          }
        </div>
      </>)}
      {/* <h1>Collections</h1> */}
      {collections && (
        <CollectionList collections={
          collections
            .filter((collection) => (
              collection.name?.toLowerCase() !== 'all'
              && collection.name?.toLowerCase() !== 'lent out'
              && collection.name?.toLowerCase() !== 'reserved'
              && collection.name?.toLowerCase() !== 'borrowed'
            ))
        } />
      )}
    </div>
  </>)
}