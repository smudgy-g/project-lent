import { useEffect, useState, useContext } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from 'react-router-dom';
import { getAllCollections, getItemById, putItemById } from "../../service/apiService";
import { Collection, Item } from "../../types/types";

export default function ItemEdit() {

  /* State Variables */

  const [collections, setCollections] = useState<Collection[]>([])
  const [formData, setFormData] = useState<Item>({
    name: '',
    description: '',
    img_url: undefined,
    lendable: false,
    value: 0
  });

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();
  const { itemId } = useParams();

  /* Use Effects */

  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  useEffect(() => {
    if (itemId) {
      getItemById(itemId)
        .then((item) => setFormData(item))
        .catch((error) => console.log(error));
    }
  }, [itemId]);

  useEffect(() => {
    getAllCollections()
      .then((result) => {
        const filteredResult = result.filter(
          (collection) =>
            collection.name !== "All" &&
            collection.name !== "Lent Out" &&
            collection.name !== "Borrowed" &&
            collection.name !== "Reserved"
        );
        setCollections(filteredResult);
      })
      .catch((error) => console.log(error));
  }, []);

  /* Handler Functions */

  // When the user changes one of the form inputs,
  // update the formData state variable
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked, files } = event.target;

    // By default, set the input value as the fieldValue
    let fieldValue: boolean | string = value;

    // If the target is a checkbox input, set the fieldValue
    // according to the checked state of the input
    if (type === 'checkbox') fieldValue = checked;

    // If the target is a file input, convert the file to
    // a base64 string and set it as the fieldValue
    if (type === 'file') {
      // Use the first file of the input’s FilesList
      const file = files![0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          fieldValue = base64String;
          // Update the form data with the changed data
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: fieldValue
          }));
        };
        reader.readAsDataURL(file);
      }
    }

    // If the target is not a file input:
    else {
      // Update the form data with the changed data
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: fieldValue
      }));
    }
  };

  // When the user clicks the "Save Changes button,
  // PUT the item using the API service
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const collectionElement = document.getElementById('collection');
      if (collectionElement) {
        const selectedCollections: string[] = Array.from((collectionElement as HTMLSelectElement).selectedOptions, option => option.value);
        // Rest of your code using selectedCollections
        const updatedFormData = {
          ...formData,
          collections: selectedCollections.filter((result) => result !== 'all'),
        }

        console.log(itemId, updatedFormData)
        //const response = await putItemById(itemId!, updatedFormData);
        navigate(`/item/${itemId}`);

      } else {
      console.log(itemId, formData)
      //const response = await putItemById(itemId!, formData);
      navigate(`/item/${itemId}`);
    }
  };

  /* Render Component */

  return (<>
    <div className="profile-edit">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Description:
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        {collections.length > 1 && (
        <label>
          Collection:
          <select id="collection" name="collection" multiple>
          <option value="all" disabled selected>
            All
          </option>
            {collections.map((collection: Collection) => {
              return (
                <option key={collection._id} value={collection._id}>
                  {collection.name}
                </option>
                
              );
            })}
          </select>
        </label>
        )}

        <div className="image-thumbnail" style={{backgroundImage: `url(${formData.img_url})`}}></div>


        <label>
          Photo:
          <input
            type="file"
            name="img_url"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <div className="input-wrapper">
          Lend out?
          <label className="toggle-switch">
            <input
              type="checkbox"
              name="lendable"
              id="lendable"
              checked={formData.lendable}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>

        {formData.lendable && (
          <label>
            Value:
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
            />
          </label>
        )}

        <button
          className="button styled full large"
          type="submit"
          disabled={
            formData.name === '' ||
            formData.description === '' ||
            formData.img_url === ''
          }
        >Save Changes</button>
      </form>
    </div>

  </>);
}