import { FC, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import styles from "./FormulaInput.module.scss";
import { useFormulaStore } from "@state/useFormulaStore";
import { AutocompleteList } from "@components/AutocompleteList";
import { Suggestion } from "@hooks/useAutocomplete";
import { evaluate } from "mathjs";
import { TagDropdown } from "@components/TagDropdown";

interface FormulaInputProps {
  onCalculated: (val: string) => void;
}

export const FormulaInput: FC<FormulaInputProps> = ({ onCalculated }) => {
  const { tokens, addToken, removeToken, tagValues } = useFormulaStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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

    try {
      const result = evaluate(expr.trim());
      setError(null);
      onCalculated(result.toString());
    } catch (err) {
      setError("Invalid expression");
      onCalculated("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        if (inputValue.trim()) {
          if (!tokens.some(token => token.name === inputValue.trim() && token.type === "tag")) {
            addToken({
              id: crypto.randomUUID(),
              name: inputValue.trim(),
              type: "tag",
            });
          }
          setInputValue("");
        }
      }

      if (e.key === "Backspace" && inputValue === "") {
        e.preventDefault();
        if (tokens.length > 0) {
          const lastToken = tokens[tokens.length - 1];
          removeToken(lastToken.id);
        }
      }
    }, 100);
  };

  const handleAutocompleteSelect = (item: Suggestion) => {
    if (!tokens.some(token => token.name === item.name && token.type === "tag")) {
      addToken({
        id: item.id,
        name: item.name,
        type: "tag",
      });
    }
    setInputValue("");
  };

  const handleTagSelect = (tag: string) => {
    if (!tokens.some(token => token.name === tag && token.type === "tag")) {
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
        {tokens.map((token) =>
          token.type === "tag" ? (
            <Box key={token.id} className={styles.token} onClick={(e) => handleTagClick(e)}>
              <span>{token.name}</span>
              <TagDropdown
                anchorEl={anchorEl}
                open={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
                onSelect={handleTagSelect}
                showModal={false}
                setShowModal={() => {}}
              />
            </Box>
          ) : (
            <Box key={token.id} className={styles.token}>
              {token.name}
            </Box>
          )
        )}
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
