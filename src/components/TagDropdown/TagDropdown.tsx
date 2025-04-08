import { FC, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import styles from "./TagDropdown.module.scss";
import { CustomTimestampModal } from "@components/CustomTimestampModal";
import { SECTIONS } from "./mock";

interface TagDropdownProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

export const TagDropdown: FC<TagDropdownProps> = ({
  anchorEl,
  open,
  onClose,
  onSelect,
  showModal,
  setShowModal,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: string) => {
    if (item === "Custom") {
      setShowModal(true);
    } else {
      onSelect(item);
    }
    onClose();
  };

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown: EventListener = (e) => {
      if (e instanceof KeyboardEvent && e.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <Box>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        className={styles.popper}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ]}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Paper ref={scrollRef} className={styles.dropdown}>
            {SECTIONS.map((section) => (
              <Box key={section.title}>
                <Typography className={styles.sectionTitle}>
                  {section.title}
                </Typography>
                <List>
                  {section.items.map((item) => (
                    <ListItemButton
                      key={item}
                      onClick={() => handleSelect(item)}
                      className={styles.listItem}
                    >
                      <span role="img" aria-label="clock">
                        {item === "Custom" ? "⚙️" : "🕒"}
                      </span>{" "}
                      {item}
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>

      <CustomTimestampModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={(value) => {
          onSelect(value);
        }}
      />
    </Box>
  );
};
