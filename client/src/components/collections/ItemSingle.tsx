import { useContext, useEffect, useState } from "react";
import { ActionButtonGroupData, Collection, Item } from "../../types/types";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { cancelItemById, deleteItem, getAllCollections, getItemById, getItemsByCollection, putItemReserve, receiveItemById, returnItemById } from "../../service/apiService";

interface IUserRole {
  isOwner: boolean;
  isReserver: boolean;
  isBorrower: boolean;
}

export default function ItemSingle () {

  /* State Variable */

  const [item, setItem] = useState<Item | null>(null);
  const [userRole, setUserRole] = useState<IUserRole>({
    isOwner: false,
    isReserver: false,
    isBorrower: false,
  });

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();
  const { itemId } = useParams();

  /* Use Effect */

  // Get the item data through the API service
  useEffect(() => {
    if (itemId) {
      getItemById(itemId)
        .then((item) => setItem(item))
        .catch((error) => console.log(error));
    }
  }, [itemId]);

  // Get the user’s collections data, and
  // set the user role according to the item’s ID
  useEffect(() => {
    if (itemId) {
      getUserRoleByItem(itemId)
        .then((userRole) => setUserRole(userRole))
        .catch((error) => console.log(error));
    }
  }, [itemId])

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

  /* Helper functions */

  // Get the user role for a specified item by its ID
  async function getUserRoleByItem (itemId: string) {
    const collections = await getAllCollections();

    const isOwner = await checkItemInCollection(collections, 'all', itemId);
    const isReserver = await checkItemInCollection(collections, 'reserved', itemId);
    const isBorrower = await checkItemInCollection(collections, 'borrowed', itemId);

    return {
      isOwner,
      isReserver,
      isBorrower,
    }
  }
  // Check if an item is part of a specified collection
  async function checkItemInCollection (collections: Collection[], collectionName: string, itemId: string) {
    const collection = collections.find((collection) => collection.name?.toLowerCase() === collectionName);
    const items = await getItemsByCollection(collection?._id!);
    return items.some((item) => item._id === itemId);
  }

  /* Event Handlers */

  // When the user clicks on the “Reserve” button
  function handleClickReserve () {
    if (item && item._id) {
      putItemReserve(item._id)
        .then(() => navigate('/inbox'))
        .catch((error) => console.log(error));
    }
  };
  // When the user clicks on the “Cancel Reservation” or “Decline Reservation” button
  async function handleClickCancel() {
    try {
      if (item && itemId) {
        cancelItemById(itemId)
          .then(() => item.available = true)
          .catch((error) => console.log(error));
      };
    }
    catch (error) {
      console.log(error);
    }
  };
  // When the user clicks on the “Item Received” button
  async function handleClickReceived() {
    try {
      if (item && itemId) {
        receiveItemById(itemId)
          .then(() => item.borrowed = true)
          .catch((error) => console.log(error));
      }
    }
    catch (error) {
      console.log(error);
    }
  };
  // When the user clicks on the “Item Returned” button
  async function handleClickReturned() {
    try {
      if (item && itemId) {
        returnItemById(itemId)
          .then(() => {
            item.borrowed = false;
            item.available = true;
          })
          .catch((error) => console.log(error));
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  /* Render Component */

  return (<>
    {item && (
      <div className="item-single">
        <div className="image" style={{backgroundImage: `url(${item?.img_url})`}}></div>

        <div className="information">
          <div className="metadata">
            <div className="metadata-group">
              {item.distance && <span className="distance">{item.distance.toFixed(1)} km</span>}
              {item.lendable && item.value && <span className="value">{`¤ ${item.value}`}</span>}
            </div>
            {item.lendable && item.available && <span className="status available">• available</span>}
            {item.lendable && !item.available && !item.borrowed && <span className="status reserved">• reserved</span>}
            {item.lendable && !item.available && item.borrowed && <span className="status borrowed">• borrowed</span>}
          </div>

          <h1 className="title">{item.name}</h1>
          <p className="description">{item.description}</p>
        </div>

        <div className="button-group end">
          {item.distance && item.lendable && item.available && (
            <button className="button styled secondary full large end" onClick={handleClickReserve}>
              {`Reserve (¤ ${item.value})`}
            </button>
          )}
          {item.lendable && !item.available && userRole && userRole.isReserver && (
            <button
              className="button styled alert full large"
              onClick={handleClickCancel}>
              Cancel Reservation
            </button>
          )}
          {item.lendable && !item.available && userRole && userRole.isOwner && (
            <button
              className="button styled alert full large"
              onClick={handleClickCancel}>
              Decline Reservation
            </button>
          )}
          {userRole && userRole.isReserver && (
            <button
              className="button styled secondary full large"
              onClick={handleClickReceived}>
              Item Received
            </button>
          )}
          {item.borrowed && userRole && userRole.isOwner && (
            <button
              className="button styled secondary full large end"
              onClick={handleClickReturned}>
              Item Returned
            </button>
          )}
        </div>
      </div>
    )}
  </>);
}