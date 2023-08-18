import { useEffect, useState, useContext } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate } from 'react-router-dom';
import { postItem } from "../../service/apiService";
import { Item } from "../../types/types";

export default function ItemAdd() {

  /* State Variables */

  const [formData, setFormData] = useState<Item>({
    name: '',
    description: '',
    img_url: undefined,
    lendable: false,
    value: 999
  });

  /* Hooks */

  const { setActionButtonGroupData } = useContext<HeaderContextProps>(HeaderContext);
  const navigate = useNavigate();

  /* Use Effects */

  useEffect(() => {
    setActionButtonGroupData([]);
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

  // When the user clicks the “Add Item” button,
  // POST the item using the API service
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const response = await postItem(formData);
    navigate(`/item/${response._id}`);
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

        <label>
          Photo:
          <input
            type="file"
            name="img_url"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <label>
          Lend out?
          <input
            type="checkbox"
            name="lendable"
            onChange={handleChange}
          />
        </label>

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

  </>);
}