import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
  Alert,
  Snackbar,
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
  const [categories, setCategories] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "",
      category: "",
      description: "",
      amount: undefined,
      paymentMethod: "",
      eatingOut: false,
    },
  });

  const type = watch("type");

  // 収入/支出の選択に応じてカテゴリーを更新
  useEffect(() => {
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
      amount: undefined,
      paymentMethod: "",
      eatingOut: false,
    });
  };

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Google Formsへの送信
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "eatingOut") {
            if (value === true) {
              formData.append(`entry.${getEntryId(key)}`, "外食");
            }
          } else if (key === "date") {
            // 日付をハイフン区切りからスラッシュ区切りに変換
            const dateValue = value.toString().replace(/-/g, "/");
            formData.append(`entry.${getEntryId(key)}`, dateValue);
          } else {
            formData.append(`entry.${getEntryId(key)}`, value.toString());
          }
        }
      });

      // FormDataをURLSearchParamsに変換
      const params = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        params.append(key, value.toString());
      }

      const response = await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLScoM_D0sgx9sCPpMbWa8C1jp_FoMKhuCmwXh0e6g6mfsDCKeQ/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: params,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("送信レスポンス:", response);

      // 成功メッセージの表示
      setShowSuccessMessage(true);
      reset();
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
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

        {watch("category") === "食費" && (
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
        )}

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
              value={field.value || ""}
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

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "保存"}
          </Button>
          <Button type="button" onClick={handleReset} variant="outlined">
            リセット
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccessMessage} severity="success">
          登録完了！
        </Alert>
      </Snackbar>
    </Container>
  );
}

// Google FormsのエントリーIDを取得する関数
function getEntryId(key: string): string {
  const entryMap: Record<string, string> = {
    date: "1683306364",
    type: "1284079828",
    category: "1638872185",
    description: "510324176",
    amount: "64140339",
    paymentMethod: "641361729",
    eatingOut: "1947501817",
  };
  return entryMap[key] || "";
}

export default App;
