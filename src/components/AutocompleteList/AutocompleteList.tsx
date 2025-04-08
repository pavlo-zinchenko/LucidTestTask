import { FC, RefObject, useEffect, useRef, useState } from "react";
import {
  Box,
  ClickAwayListener,
  List,
  ListItemButton,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { useAutocomplete, Suggestion } from "@hooks/useAutocomplete";

interface AutocompleteListProps {
  search: string;
  onSelect: (item: Suggestion) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export const AutocompleteList: FC<AutocompleteListProps> = ({
  search,
  onSelect,
  inputRef,
}) => {
  const { data = [], isLoading } = useAutocomplete(search);
  const filtered = data.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (search && filtered.length > 0) {
      setOpen(true);
      setActiveIndex(0);
    } else {
      setOpen(false);
    }
  }, [search, filtered.length]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(filtered[activeIndex]);
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <Popper
      open={open}
      anchorEl={inputRef.current}
      placement="bottom-start"
      style={{ zIndex: 10, width: inputRef.current?.offsetWidth }}
    >
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Paper
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            mt: 1,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {isLoading ? (
            <Typography variant="body2" p={1}>
              Loading...
            </Typography>
          ) : (
            <List dense ref={listRef}>
              {filtered.map((item, index) => (
                <ListItemButton
                  key={item.id}
                  selected={index === activeIndex}
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <span>{item.name}</span>
                    <Typography variant="caption" color="text.secondary">
                      {item.category}
                    </Typography>
                  </Box>
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
