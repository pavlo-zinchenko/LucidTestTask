import {
  FC,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./FormulaInput.module.scss";
import { useFormulaStore } from "@state/useFormulaStore";
import { AutocompleteList } from "@components/AutocompleteList";
import { Suggestion } from "@hooks/useAutocomplete";
import { evaluate } from "mathjs";
import { TagDropdown } from "@components/TagDropdown";
import { OPERATORS } from "./utils";

interface FormulaInputProps {
  onCalculated: (val: string) => void;
}

export const FormulaInput: FC<FormulaInputProps> = ({ onCalculated }) => {
  const { tokens, addToken, removeToken, tagValues } = useFormulaStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [validTags, setValidTags] = useState<string[]>([]);

  useEffect(() => {
    calculateExpression();
  }, [tokens, tagValues]);

  const calculateExpression = () => {
    let expr = "";

    for (const token of tokens) {
      if (token.type === "tag") {
        const val = tagValues[token.name];
        if (val === undefined || val === null) {
          onCalculated("");
          setError(`Missing value for tag: "${token.name}"`);
          return;
        }
        expr += val + " ";
      } else {
        expr += token.name + " ";
      }
    }

    expr = expr.trim();

    try {
      const result = evaluate(expr);
      setError(null);
      onCalculated(result.toString());
    } catch (err) {
      setError("Invalid expression");
      onCalculated("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      if (inputValue.trim()) {
        if (OPERATORS.includes(inputValue.trim())) {
          addToken({
            id: crypto.randomUUID(),
            name: inputValue.trim(),
            type: "operator",
          });
        } else if (!isNaN(Number(inputValue.trim()))) {
          addToken({
            id: crypto.randomUUID(),
            name: inputValue.trim(),
            type: "number",
          });
        } else if (validTags.includes(inputValue.trim())) {
          addToken({
            id: crypto.randomUUID(),
            name: inputValue.trim(),
            type: "tag",
          });
        }
        setInputValue("");
      }
    }

    if (e.key === "Backspace") {
      e.preventDefault();

      if (inputValue) {
        setInputValue(inputValue.slice(0, -1));
      } else if (tokens.length > 0) {
        const lastToken = tokens[tokens.length - 1];
        removeToken(lastToken.id);
      }
    }
  };

  const handleAutocompleteSelect = (item: Suggestion) => {
    if (
      !tokens.some((token) => token.name === item.name && token.type === "tag")
    ) {
      addToken({
        id: item.id,
        name: item.name,
        type: "tag",
      });
      setValidTags((prev) => [...prev, item.name]);
    }
    setInputValue("");
  };

  const handleTagSelect = (tag: string) => {
    if (!tokens.some((token) => token.name === tag && token.type === "tag")) {
      addToken({
        id: crypto.randomUUID(),
        name: tag,
        type: "tag",
      });
    }
    setDropdownOpen(false);
  };

  const handleTagClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
    setDropdownOpen(true);
  };

  return (
    <>
      <Box className={styles.inputWrapper}>
        =
        {tokens.map((token) => (
          <Box key={token.id} className={styles.tokenWrapper}>
            {token.type === "tag" && ( // Only show dropdown for tags
              <Box className={styles.token} onClick={(e) => handleTagClick(e)}>
                <span>{token.name}</span>
                <IconButton
                  size="small"
                  onClick={(e) => handleTagClick(e)}
                  sx={{ marginLeft: "8px" }}
                >
                  <ArrowDropDownIcon fontSize="small" />
                </IconButton>
                <TagDropdown
                  anchorEl={anchorEl}
                  open={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  onSelect={handleTagSelect}
                  showModal={false}
                  setShowModal={() => {}}
                />
              </Box>
            )}

            {token.type === "operator" && (
              <Box className={styles.circle}>{token.name}</Box>
            )}

            {token.type === "number" && (
              <Box className={styles.circle}>{token.name}</Box>
            )}
          </Box>
        ))}
        <input
          ref={inputRef}
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Box>

      <AutocompleteList
        search={inputValue}
        onSelect={handleAutocompleteSelect}
        inputRef={inputRef}
      />

      <Box>
        <Typography variant="body2" color="textSecondary">
          Supported operations: +, -, *, /, ^, (), and tags like: name1, name2,
          etc.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Note: Missing values for tags will result in calculation errors.
        </Typography>
        {error && (
          <Typography variant="caption" color="error" mt={1}>
            {error}
          </Typography>
        )}
      </Box>
    </>
  );
};
