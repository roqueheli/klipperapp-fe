"use client";

import { Branch } from "@/types/branch";
import { createContext, useContext, useState } from "react";

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  setBranches: (branches: Branch[]) => void;
}

const BranchContext = createContext<BranchContextType>({
  branches: [],
  selectedBranch: null,
  setSelectedBranch: () => {},
  setBranches: () => {},
});

export const BranchProvider = ({
  children,
  initialBranches,
  initialSelected,
}: {
  children: React.ReactNode;
  initialBranches: Branch[];
  initialSelected: Branch;
}) => {
  const [branches, setBranches] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState(initialSelected);

  return (
    <BranchContext.Provider
      value={{ branches, selectedBranch, setSelectedBranch, setBranches }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);
