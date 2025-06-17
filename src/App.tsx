import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

// フォームの型定義
interface ExpenseFormData {
  date: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  eatingOut: boolean;
}

// バリデーションスキーマ
const schema = yup
  .object({
    date: yup.string().required("日付は必須です"),
    type: yup.string().required("収入/支出は必須です"),
    category: yup.string().required("項目は必須です"),
    description: yup.string().default(""),
    amount: yup
      .number()
      .required("金額は必須です")
      .positive("正の数を入力してください"),
    paymentMethod: yup.string().required("支払い方法は必須です"),
    eatingOut: yup.boolean().default(false),
  })
  .required();

function App() {
  const [categories, setCategories] = React.useState<string[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "",
      category: "",
      description: "",
      amount: 0,
      paymentMethod: "",
      eatingOut: false,
    },
  });

  const type = watch("type");

  // 収入/支出の選択に応じてカテゴリーを更新
  React.useEffect(() => {
    if (type === "収入") {
      setCategories(["給与", "副業", "臨時収入", "その他・収入"]);
    } else if (type === "支出") {
      setCategories([
        "食費",
        "雑費",
        "日用品",
        "交通費",
        "趣味・娯楽",
        "教養・教育",
        "衣服・美容",
        "自動車",
        "健康・医療",
        "水道・光熱費",
        "通信費",
        "保険",
        "住宅",
        "その他・貯金",
        "予算外",
      ]);
    } else if (type === "チャージ" || type === "入金") {
      setCategories(["財布"]);
    } else {
      setCategories([]);
    }
  }, [type]);

  const handleReset = () => {
    reset({
      date: new Date().toISOString().split("T")[0],
      type: "",
      category: "",
      description: "",
      amount: 0,
      paymentMethod: "",
      eatingOut: false,
    });
  };

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
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              label="日付"
              type="date"
              {...field}
              error={!!errors.date}
              helperText={errors.date?.message}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="収入 or 支出"
              {...field}
              error={!!errors.type}
              helperText={errors.type?.message}
            >
              <MenuItem value="">選択してください</MenuItem>
              <MenuItem value="収入">収入</MenuItem>
              <MenuItem value="支出">支出</MenuItem>
              <MenuItem value="チャージ">チャージ</MenuItem>
              <MenuItem value="入金">入金</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="項目"
              {...field}
              error={!!errors.category}
              helperText={errors.category?.message}
            >
              <MenuItem value="">選択してください</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              label="内容"
              {...field}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <TextField
              label="金額"
              type="number"
              {...field}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          )}
        />

        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="支払い方法"
              {...field}
              error={!!errors.paymentMethod}
              helperText={errors.paymentMethod?.message}
            >
              <MenuItem value="">選択してください</MenuItem>
              <MenuItem value="楽天">楽天</MenuItem>
              <MenuItem value="Amazon">Amazon</MenuItem>
              <MenuItem value="イオン">イオン</MenuItem>
              <MenuItem value="現金">現金</MenuItem>
              <MenuItem value="チャージ">チャージ</MenuItem>
              <MenuItem value="口座振替">口座振替</MenuItem>
              <MenuItem value="セゾン（高速料金）">セゾン（高速料金）</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="eatingOut"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
              }
              label="外食"
            />
          )}
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button type="submit" variant="contained" color="primary">
            保存
          </Button>
          <Button type="button" onClick={handleReset} variant="outlined">
            リセット
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
