import { useContext, useEffect } from "react";
import { HeaderContext, HeaderContextProps } from "../contexts/HeaderContext";
import { Link } from "react-router-dom";

export default function Test () {

  /* Use Context */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  useEffect(() => {
    const localActionButtonGroupData = [
      {
        title: 'Aaaand…',
        action: () => {
          console.log('Action!');
        }
      }
    ];

    setActionButtonGroupData(localActionButtonGroupData);
  }, []);

  return (<>
    <h1>Test</h1>
    <Link to={'/test2'}><button>Link to other test site</button></Link>
  </>)

}