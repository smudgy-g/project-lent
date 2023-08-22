import { useEffect, useState, useContext } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate } from 'react-router-dom';
import { getAllCollections, postItem } from "../../service/apiService";
import { Item, Collection} from "../../types/types";
import CameraCapture from "../camera/CameraCapture";

export default function ItemAdd() {

  const [collections, setCollections] = useState<Collection[]>([])
  const [formData, setFormData] = useState<Item>({
    name: '',
    description: '',
    collections: [],
    img_url: undefined,
    lendable: false,
    value: 999
  });

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();

  /* Use Effects */

  useEffect(() => {
    setActionButtonGroupData([]);
  }, []);

  useEffect(() => {
    getAllCollections()
      .then((result) => {
        const filteredResult = result.filter(
          (collection) =>
            collection.name !== "Lent Out" &&
            collection.name !== "Borrowed" &&
            collection.name !== "All" &&
            collection.name !== "Reserved"
        );
        setCollections(filteredResult);
      })
      .catch((error) => console.log(error));
  }, []);

  /* Handler Functions */

  // When the user took an image
  const handleImageCapture = (imageSrc: string): void => {
    setFormData((prev) => ({
      ...prev,
      img_url: imageSrc,
    }));
  };

  // When the user changes one of the form inputs,
  // update the formData state variable
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = event.target;

    // By default, set the input value as the fieldValue
    let fieldValue: boolean | string = value;

    // If the target is a checkbox input, set the fieldValue
    // according to the checked state of the input
    if (type === 'checkbox') fieldValue = checked;

    // Update the form data with the changed data
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue
    }));
  };

  // When the user clicks the “Add Item” button,
  // POST the item using the API service
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const selectedCollections: string[] = Array.from((document.getElementById('collection') as HTMLSelectElement).selectedOptions, option => option.value);

    const updatedFormData = {
      ...formData,
      collections: selectedCollections.filter((result) => result !== 'all'),
    };

    console.log(updatedFormData)
    const response = await postItem(updatedFormData);
    navigate(`/item/${response._id}`);
  };

  /* Render Component */

  return (<>
    {!formData.img_url && <CameraCapture onImageCapture={handleImageCapture} />}
    {formData.img_url && (
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

          {collections.length > 0 && (
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

          <button type="submit"
            className="button styled full large"
            disabled={
              formData.name === '' ||
              formData.description === '' ||
              formData.img_url === ''
            }
          >Create Item</button>
        </form>
      </div>
    )}

  </>);
}