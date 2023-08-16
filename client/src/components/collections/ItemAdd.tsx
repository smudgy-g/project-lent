import { useEffect, useState, useContext } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate } from 'react-router-dom';
import { postItem } from "../../service/apiService";

export interface ItemAddFormData {
  name: string;
  description: string;
  img_url: string | null;
  lendable: boolean;
  value: number;
};

export default function ItemAdd() {

  /* State Variables */

  const [formData, setFormData] = useState<ItemAddFormData>({
    name: '',
    description: '',
    img_url: null,
    lendable: false,
    value: 0
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

    let fieldValue: boolean | File | string;
    // If the target is a checkbox input
    if (type === 'checkbox') fieldValue = checked;
    // If the target is a file input
    if (type === 'file') {
      const file = files![0];
      // Convert the file to a base64 string,
      // and set it as the field value
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          fieldValue = base64String;
        };
        reader.readAsDataURL(file);
      }
    }
    // If the target is any other input,
    // set its value as the field value
    else fieldValue = value;

    // Update the form data with the changed data
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue
    }));
  };

  // When the user clicks the “Add Item” button,
  // post the item using the API service
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(formData);
    // const response = await postItem(formData);
    // navigate(`/item/${response._id}`);
  };

  /* Render Component */

  return (<>
    <div className="profile-edit">
      <form onSubmit={handleSubmit}>
        <div className="form-element">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-element">
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-element">
          <label>
            Photo:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-element">
          <label>
            Lend out?
            <input
              type="checkbox"
              name="lendable"
              value={String(formData.lendable)}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-element">
          <label>
            Value:
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-element">
          <button type="submit"
            disabled={
              formData.name === '' ||
              formData.description === '' ||
              formData.img_url === ''
            }
          >Create Item</button>
        </div>
      </form>
    </div>

  </>);
}