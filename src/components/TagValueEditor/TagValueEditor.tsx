import { FC } from "react";
import { Box, TextField, Typography, Chip } from "@mui/material";
import styles from "./TagValueEditor.module.scss";
import { useFormulaStore } from "@state/useFormulaStore";

export const TagValueEditor: FC = () => {
  const { tokens, tagValues, updateTagValue } = useFormulaStore();

  const uniqueTags = Array.from(
    new Set(tokens.filter((t) => t.type === "tag").map((t) => t.name))
  );

  return (
    <Box className={styles.wrapper}>
      {uniqueTags.map((tag) => (
        <Box key={tag} className={styles.tagInput}>
          <Chip label={tag} color="primary" />
          <TextField
            type="number"
            size="small"
            value={tagValues[tag] ?? ""}
            onChange={(e) => updateTagValue(tag, Number(e.target.value))}
            className={styles.input}
            placeholder="value"
          />
        </Box>
      ))}

      {uniqueTags.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Add some tags first...
        </Typography>
      )}
    </Box>
  );
};
