import { useState } from "react";
import { FormulaInput } from "./components/FormulaInput";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import { TagValueEditor } from "@components/TagValueEditor";

export default function App() {
  const [result, setResult] = useState<string | null>(null);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={4}
      bgcolor="#f7f8fa"
    >
      <Card sx={{ width: "100%", maxWidth: 800, mb: 2 }}>
        <CardHeader title="Test task for Lucid" />

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TagValueEditor />
          <FormulaInput onCalculated={(val) => setResult(val)} />

          {result !== null && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" color="text.primary" sx={{ mr: 2 }}>
                Result:
              </Typography>
              <Typography variant="h6" color="primary">
                {result}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, textAlign: "center" }}
      >
        Created by Zinchenko Pavlo —{" "}
        <a
          href="mailto:pavlozinchenko.pz@gmail.com"
          style={{ textDecoration: "none" }}
        >
          pavlozinchenko.pz@gmail.com
        </a>
      </Typography>
    </Box>
  );
}
