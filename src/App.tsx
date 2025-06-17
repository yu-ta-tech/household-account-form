import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Container,
  Typography,
} from "@mui/material";

// フォームの型定義
type ExpenseFormData = {
  date: string;
  category: string;
  amount: number;
  description: string;
};

// バリデーションスキーマ
const schema = yup.object().shape({
  date: yup.string().required("日付は必須です"),
  category: yup.string().required("カテゴリーは必須です"),
  amount: yup
    .number()
    .required("金額は必須です")
    .positive("金額は正の数である必要があります"),
  description: yup.string().required("説明は必須です"),
});

// カテゴリーの選択肢
const categories = [
  "食費",
  "交通費",
  "住居費",
  "光熱費",
  "通信費",
  "娯楽費",
  "その他",
];

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: ExpenseFormData) => {
    console.log(data);
    // ここでデータの保存処理を実装
  };

  return (
    <Container>
      <Typography
        variant="h4"
        component="h1"
        sx={{ my: 4, textAlign: "center" }}
      >
        家計簿フォーム
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          mx: "auto",
          p: 2,
        }}
      >
        <TextField
          label="日付"
          type="date"
          {...register("date")}
          error={!!errors.date}
          helperText={errors.date?.message}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          label="カテゴリー"
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="金額"
          type="number"
          {...register("amount")}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />

        <TextField
          label="説明"
          multiline
          rows={2}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <Button type="submit" variant="contained" color="primary">
          保存
        </Button>
      </Box>
    </Container>
  );
}

export default App;
