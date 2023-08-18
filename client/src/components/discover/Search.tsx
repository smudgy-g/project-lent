import { useCallback, useEffect, useState } from "react";
import { Item } from "../../types/types";
import { getItemsByQuery } from "../../service/apiService";

interface SearchProps {
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  setSearchActive: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Search ({ setItems, setSearchActive }: SearchProps) {

  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Debounce the query input
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100);

    return () => clearTimeout(delay);
  }, [query]);

  const fetchItems = useCallback(async () => {
    try {
      const items = await getItemsByQuery(debouncedQuery);
      console.log('debouncedQuery:', debouncedQuery);
      console.log('items:', items);

      setItems(items);
    } catch (error) {
      console.log(error);
    }
  }, [debouncedQuery, setItems]);

  // Fetch items when debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery) {
      setSearchActive(true);
      fetchItems();
    } else {
      setSearchActive(false);
    }
  }, [debouncedQuery, fetchItems, setSearchActive]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  /* Render Component */

  return (<>
    <div className="search">
      <input type="search" placeholder="Search" value={query} onChange={handleChange} />
    </div>
  </>)
}