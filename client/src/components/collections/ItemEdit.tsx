import { useEffect, useState, useContext } from "react";
import { HeaderContext, HeaderContextProps } from "../../contexts/HeaderContext";
import { useNavigate, useParams } from 'react-router-dom';
import { getItemById, putItemById } from "../../service/apiService";

export interface ItemEditFormData {
  name: string;
  description: string;
  img_url: string | null;
  lendable: boolean;
  value: number;
};

export default function ItemEdit() {

  /* State Variables */

  const [formData, setFormData] = useState<ItemEditFormData>({
    name: '',
    description: '',
    img_url: null,
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


  /* Handler Functions */

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked, files } = event.target;
    const fieldValue = type === 'checkbox' ? checked : type === 'file' ? files![0] : value; // FIX "files!" <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue
    }));
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (itemId) {
      await putItemById(itemId, formData);
      navigate(`/item/${itemId}`);
    }
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
              capture="environment"
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
          >Save Changes</button>
        </div>
      </form>
    </div>

  </>);
}