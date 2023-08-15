import { useContext, useEffect, useState } from "react";
import { Item } from "../../types/types";
import { ActionButtonGroupData, HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { deleteItem, getItemById } from "../../service/apiService";

export default function ItemSingle () {


  const [item, setItem] = useState<Item | null>(null);

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();
  const { itemId } = useParams();

  /* Use Effect */

  useEffect(() => {
    if (itemId) {
      getItemById(itemId)
        .then((item) => setItem(item))
        .catch((error) => console.log(error));
    }
  }, [itemId]);

  // Populate the Header component’s action button group
  useEffect(() => {
    const localActionButtonGroupData: ActionButtonGroupData = [
      {
        title: 'Edit Item',
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
    ]
    setActionButtonGroupData(localActionButtonGroupData);
  }, [itemId]);

  /* Render Component */

  return (<>
    <div className="item-single">
      <h1>{item?.name}</h1>
    </div>
  </>);
}