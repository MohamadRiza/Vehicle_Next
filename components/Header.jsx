import { CheckUser } from "@/lib/CheckUser";
import React from "react";
import HeaderClient from "./Header-Client";

const Header = async ({ isAdminPage = false }) => {
  const user = await CheckUser();

  return <HeaderClient user={user} isAdminPage={isAdminPage} />;
};

export default Header;
