import { ReactElement } from "react";
import { RequireAuth } from "react-auth-kit";
import Header from "./components/navigation/Header";
import TabNavigation from "./components/navigation/TabNavigation";
import Modal from "./components/modal/modal";

interface LayoutOptions {
  requireAuth?: boolean,
  header?: boolean,
  tabNavigation?: boolean,
  modal?: boolean,
}

interface LayoutProps {
  children: ReactElement;
  options?: LayoutOptions;
}

export default function Layout ({ children, options = {
  requireAuth: true,
  header: true,
  tabNavigation: true,
  modal: true}
}: LayoutProps) {

  const {
    requireAuth = true,
    header = true,
    tabNavigation = true,
    modal = true
  } = options;

  return (
    <>
      {header ? <Header /> : <div></div>}
      {requireAuth ? (<RequireAuth loginPath="/login">
        {children}
      </RequireAuth>) : ({children})}
      {tabNavigation && <TabNavigation />}
      {modal && <Modal />}
    </>
  );
};