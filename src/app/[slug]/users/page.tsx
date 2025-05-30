"use client";

import { useOrganization } from "@/contexts/OrganizationContext";

const UsersPage = () => {
  const { slug } = useOrganization();
  return <div>{slug}</div>;
};

export default UsersPage;
