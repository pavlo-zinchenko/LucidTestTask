import { FC, useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import styles from "./Tag.module.scss";
import { TagDropdown } from "@components/TagDropdown";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface TagProps {
  name: string;
  selectedTime?: string;
  onSelectTime: (value: string) => void;
}

export const Tag: FC<TagProps> = ({ name, selectedTime, onSelectTime }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);

  return (
    <Box className={styles.tagWrapper}>
      <Box className={styles.tag}>
        {name}
        <Box className={styles.rightTag}>
          <Box>{selectedTime}</Box>
          <IconButton
            size="small"
            onClick={() => setDropdownOpen((prev) => !prev)}
            ref={iconRef}
            sx={{ marginLeft: "4px" }}
          >
            <ArrowDropDownIcon fontSize="small" />
          </IconButton>
        </Box>
        <TagDropdown
          anchorEl={iconRef.current}
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          onSelect={onSelectTime}
          showModal={modalOpen}
          setShowModal={setModalOpen}
        />
      </Box>
    </Box>
  );
};
