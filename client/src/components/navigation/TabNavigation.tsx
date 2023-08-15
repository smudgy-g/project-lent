import { Link } from "react-router-dom";

export default function TabNavigation () {
  return (<>
    <div className="tab-navigation">
      <Link to={'/profile'}><button className="button">Profile</button></Link>
      <Link to={'/collections'}><button className="button">Collections</button></Link>
      <Link to={'/discover'}><button className="button">Discover</button></Link>
      <Link to={'/inbox'}><button className="button">Messages</button></Link>
      <Link to={'/item/add'}><button className="button">Add Item</button></Link>
    </div>
  </>)
}