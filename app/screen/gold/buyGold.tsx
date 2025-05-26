import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  Platform,
  ScrollView, // 👈 THÊM DÒNG NÀY
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { addTransaction } from "../../DB/service/transactionService";

const GOLD_UNIT_MULTIPLIER = {
  "chỉ": 3.75,
  "lượng": 37.5,
  "gram": 1,
};

const fetchGoldPrice = async (date: Date): Promise<number> => {
  try {
    const GOLD_API_KEY = "goldapi-72319m9r50j9s-io";
    const formattedDate = date.toISOString().split("T")[0];
    const goldRes = await fetch(`https://www.goldapi.io/api/XAU/USD?date=${formattedDate}`, {
      headers: {
        "x-access-token": GOLD_API_KEY,
        "Content-Type": "application/json",
      },
    });
    const goldData = await goldRes.json();
    if (!goldData.price) throw new Error("No gold price");

    const pricePerGramUSD = goldData.price / 31.1;

    const fxRes = await fetch("https://open.er-api.com/v6/latest/USD");
    const fxData = await fxRes.json();
    const usdToVnd = fxData.rates?.VND;
    if (!usdToVnd) throw new Error("No USD→VND rate");

    return pricePerGramUSD * usdToVnd;
  } catch (error) {
    console.error(error);
    Alert.alert("Lỗi", "Không thể lấy dữ liệu giá vàng.");
    return 0;
  }
};

export default function GoldTransactionScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [unit, setUnit] = useState<keyof typeof GOLD_UNIT_MULTIPLIER>("chỉ");
  const [quantity, setQuantity] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    (async () => {
      const price = await fetchGoldPrice(date);
      setGoldPrice(price);
    })();
  }, [date]);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const calculateAmount = (): number => {
    const qty = parseFloat(quantity);
    if (isNaN(qty)) return 0;
    const gram = qty * GOLD_UNIT_MULTIPLIER[unit];
    return gram * goldPrice;
  };

  const handleAddTransaction = async () => {
    const amount = calculateAmount();
    if (amount === 0 || isNaN(amount)) {
      Alert.alert("Lỗi", "Vui lòng nhập khối lượng hợp lệ.");
      return;
    }

    const formattedDate = date
      .toLocaleDateString("en-GB")
      .split("/")
      .reverse()
      .join("-");

    const transaction = {
      type: "expense",
      category: "buyGold",
      categoryName: "Mua Vàng",
      amount,
      date: formattedDate,
      note,
    };

    await addTransaction(transaction);

    Alert.alert("✔️ Thành công", "Đã thêm giao dịch vàng.");
    setQuantity("");
  };

  const pricePerChi = goldPrice * GOLD_UNIT_MULTIPLIER["chỉ"];
  const pricePerLuong = goldPrice * GOLD_UNIT_MULTIPLIER["lượng"];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Giao dịch mua vàng</Text>

        <Text style={styles.label}>Chọn ngày:</Text>
        <Pressable onPress={() => setShowPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>
            {date.toLocaleDateString("vi-VN")}
          </Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Giá vàng 24k (1 gram):</Text>
        {goldPrice > 0 ? (
          <Text style={styles.price}>{goldPrice.toLocaleString()} VND/gram</Text>
        ) : (
          <ActivityIndicator size="small" color="#000" />
        )}

        <Text style={styles.label}>Giá vàng theo chỉ (3.75g):</Text>
        <Text style={styles.price}>{pricePerChi.toLocaleString()} VND/chỉ</Text>

        <Text style={styles.label}>Giá vàng theo lượng (37.5g):</Text>
        <Text style={styles.price}>{pricePerLuong.toLocaleString()} VND/lượng</Text>

        <Text style={styles.label}>Đơn vị vàng:</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={unit} onValueChange={(val) => setUnit(val)}>
            {Object.keys(GOLD_UNIT_MULTIPLIER).map((key) => (
              <Picker.Item key={key} label={key} value={key} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Khối lượng:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Nhập số lượng"
          value={quantity}
          onChangeText={setQuantity}
        />
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          placeholder="Ghi chú"
          placeholderTextColor="#555"
          value={note}
          onChangeText={setNote}
          style={styles.input}
        />

        <Text style={styles.label}>Số tiền quy đổi:</Text>
        <Text style={styles.amount}>{calculateAmount().toLocaleString()} VND</Text>
        <Pressable style={styles.button} onPress={handleAddTransaction}>
          <Text style={styles.buttonText}>Thêm giao dịch mua</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
  },
  price: {
    fontSize: 18,
    color: "#4caf50",
    marginVertical: 3,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    fontSize: 16,
  },
  amount: {
    fontSize: 18,
    color: "#d00000",
    marginTop: 10,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
