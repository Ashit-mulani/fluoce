import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderIcon } from "@/components/ui/Svg";
import React from "react";

const SelectFolder = ({ folders, value, onChange, excludeFolderId }) => {
  const filteredFolders = excludeFolderId
    ? folders?.filter((f) => f._id !== excludeFolderId)
    : folders;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="select folder" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {filteredFolders?.map((f) => (
            <SelectItem key={f?._id || f?.name} value={f?._id}>
              <FolderIcon size={22} />
              {f?.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectFolder;
