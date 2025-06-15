import React from "react";
import { ExpenseForm } from "./components/ExpenseForm";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography
        variant="h4"
        component="h1"
        sx={{ my: 4, textAlign: "center" }}
      >
        家計簿フォーム
      </Typography>
      <ExpenseForm />
    </Container>
  );
}

export default App;
