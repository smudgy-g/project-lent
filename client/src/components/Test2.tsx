import { useContext, useEffect } from "react";
import { HeaderContext, HeaderContextProps } from "../contexts/HeaderContext";

export default function Test2 () {

  /* Use Context */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);

  useEffect(() => {
    const localActionButtonGroupData = [
      {
        title: 'Other site',
        action: () => {
          console.log('Oction!');
        }
      }
    ];

    setActionButtonGroupData(localActionButtonGroupData);
  }, []);

  return (<>
    <h1>Other Test Site</h1>
  </>)

}