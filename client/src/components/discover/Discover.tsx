import { useContext, useEffect, useState } from "react";
import { Item } from "../../types/types";
import ItemList from "../collections/ItemList";
import { getItemsDiscover } from "../../service/apiService";
import Search from "./Search";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";

export default function Discover () {

  const [items, setItems] = useState<Item[]>([]);
  const [searchActive, setSearchActive] = useState<boolean>(false);

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  useEffect(() => {
    setActionButtonGroupData([])
  }, [setActionButtonGroupData]);

  useEffect(() => {
    if (!searchActive) {
      getItemsDiscover()
        .then((items) => setItems(items))
        .catch((error) => console.log(error));
    }
  }, [searchActive]);

  /* Render Component */

  return (<>
    <div className="discover">
      <Search setItems={setItems} setSearchActive={setSearchActive} />
      <h1>Around you</h1>
      <ItemList items={items} />
    </div>
  </>)
}