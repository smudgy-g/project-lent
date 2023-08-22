import { useState } from "react";

export default function useHistory () {
  const [previousPage, setPreviousPage] = useState('');
  const [currentPage, setCurrentPage] = useState('');

  const update = (pageName: string) => {
    setPreviousPage(currentPage);
    setCurrentPage(pageName);

    console.log('prev', previousPage);
    console.log('curr', currentPage);
  };

  return {
    previousPage,
    currentPage,
    update
  }
}