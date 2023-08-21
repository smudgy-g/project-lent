import { useContext, useEffect, useState } from "react";
import { Item } from "../../types/types";
import { ActionButtonGroupData, HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { deleteItem, getItemById, putItemReserve } from "../../service/apiService";

export default function ItemSingle () {

  /* State Variable */

  const [item, setItem] = useState<Item | null>(null);

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();
  const { itemId } = useParams();

  /* Use Effect */

  // There is some more commenting going on
  useEffect(() => {
    if (itemId) {
      getItemById(itemId)
        .then((item) => setItem(item))
        .catch((error) => console.log(error));
    }
  }, [itemId]);

  // Populate the Header component’s action button group
  useEffect(() => {
    if (item && itemId) {
      // If the user is the item’s owner
      const localActionButtonGroupDataOwner: ActionButtonGroupData = [
        {
          type: 'edit',
          title: '',
          action: () => {
            if (itemId) {
              navigate(`/item/${itemId}/edit`);
            }
          }
        },
        [
          {
            title: 'Delete Item',
            action: () => {
              if (itemId) {
                deleteItem(itemId);
                navigate(-1);
              }
            }
          }
        ]
      ];
      // If the user is NOT the item’s owner
      const localActionButtonGroupDataBorrower: ActionButtonGroupData = [];

      // Set the action button data accordingly
      setActionButtonGroupData(
        item.distance
        ? localActionButtonGroupDataBorrower
        : localActionButtonGroupDataOwner
      );
    }
  }, [item]);

  /* Event Handlers */

  function handleClickReserve () {
    if (item && item._id) {
      putItemReserve(item._id)
        .then((chat) => navigate('/inbox'))
        .catch((error) => console.log(error));
    }
  }

  /* Render Component */

  return (<>
    {item && (
      <div className="item-single">
        <div className="image" style={{backgroundImage: `url(${item?.img_url})`}}></div>

        <div className="information">
          <div className="metadata">
            <div className="metadata-group">
              {item.distance && <span className="distance">{item.distance.toFixed(1)} km</span>}
              {item.distance && item.lendable && item.value && <span className="divider">•</span>}
              {item.lendable && item.value && <span className="value">{item.value} ¢</span>}
            </div>
            {item.lendable && item.available && <span className="status available">• available</span>}
            {item.lendable && !item.available && !item.borrowed && <span className="status reserved">• reserved</span>}
            {item.lendable && !item.available && item.borrowed && <span className="status borrowed">• borrowed</span>}
          </div>

          <h1 className="title">{item.name}</h1>
          <p className="description">{item.description}</p>
        </div>

        {item.distance && (<>
          {item.lendable && item.available && <button className="button styled full large end" onClick={handleClickReserve}>{`Reserve (${item.value} ¢)`}</button>}
          {item.lendable && !item.available && <button className="button styled full large end" disabled>Unavailable</button>}
        </>)}
      </div>
    )}
  </>);
}