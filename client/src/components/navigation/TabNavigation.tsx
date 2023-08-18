import { Link } from "react-router-dom";

export default function TabNavigation () {
  return (<>
    <div className="tab-navigation">
      <Link to={'/profile'}><button className="button profile">Profile</button></Link>
      <Link to={'/collections'}><button className="button collections">Collections</button></Link>
      <Link to={'/discover'}><button className="button discover">Discover</button></Link>
      <Link to={'/inbox'}><button className="button messages">Messages</button></Link>
      <Link to={'/item/add'}><button className="button add item">Add Item</button></Link>
    </div>
  </>)
}