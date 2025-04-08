import React, { useState } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import styles from "./CustomTimestampModal.module.scss";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const CustomTimestampModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!value.trim()) {
      setError("Please enter a value");
      return;
    }

    onSave(value.trim());
    setValue("");
    setError("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modal}>
        <Typography variant="h6">Enter Custom Timestamp</Typography>

        <Box className={styles.inputArea}>
          <Box className={styles.token}>🕒 t</Box>
          <input
            placeholder="Enter custom logic..."
            className={styles.customInput}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
          />
        </Box>

        {error && (
          <Typography color="error" fontSize={12} mt={1}>
            {error}
          </Typography>
        )}

        <Box mt={2} display="flex" gap={1}>
          <Button onClick={onClose} size="small">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" size="small">
            Save
          </Button>
        </Box>

        <Box className={styles.helperSection}>
          <Typography fontWeight={600}>Single month</Typography>
          <Typography variant="body2" color="text.secondary">
            Refer to a specific date e.g. date (2023, 1), a helper variable e.g.
            LastActualDate, a relative look-back e.g. t-3 to look back 3
            timestamps
          </Typography>
        </Box>

        <Box className={styles.helperSection}>
          <Typography fontWeight={600}>Time span</Typography>
          <Typography variant="body2" color="text.secondary">
            Refer to a relative time range e.g. t-3: t-1 for last 3 timestamps,
            0:t for cumulative, or a fixed time range e.g. lastActualDate - 2 :
            lastActualDate
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};
