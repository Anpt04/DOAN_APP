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
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { addTransaction } from "../../DB/service/transactionService";
import { useTheme } from "../../contexts/themeContext";  // import theme

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
  const { theme:{colors} } = useTheme();  

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
    setNote("");
  };

  const pricePerChi = goldPrice * GOLD_UNIT_MULTIPLIER["chỉ"];
  const pricePerLuong = goldPrice * GOLD_UNIT_MULTIPLIER["lượng"];

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Giao dịch mua vàng</Text>

        <Text style={[styles.label, { color: colors.text }]}>Chọn ngày:</Text>
        <Pressable
          onPress={() => setShowPicker(true)}
          style={[styles.dateButton, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <Text style={[styles.dateText, { color: colors.text }]}>
            {date.toLocaleDateString("vi-VN")}
          </Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            textColor={colors.text}  // iOS only
          />
        )}

        <Text style={[styles.label, { color: colors.text }]}>Giá vàng 24k (1 gram):</Text>
        {goldPrice > 0 ? (
          <Text style={[styles.price, { color: colors.gold }]}>{goldPrice.toLocaleString()} VND/gram</Text>
        ) : (
          <ActivityIndicator size="small" color={colors.primary} />
        )}

        <Text style={[styles.label, { color: colors.text }]}>Giá vàng theo chỉ (3.75g):</Text>
        <Text style={[styles.price, { color: colors.gold }]}>{pricePerChi.toLocaleString()} VND/chỉ</Text>

        <Text style={[styles.label, { color: colors.text }]}>Giá vàng theo lượng (37.5g):</Text>
        <Text style={[styles.price, { color: colors.gold }]}>{pricePerLuong.toLocaleString()} VND/lượng</Text>

        <Text style={[styles.label, { color: colors.text }]}>Đơn vị vàng:</Text>
        <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Picker
            selectedValue={unit}
            onValueChange={(val) => setUnit(val)}
            style={{ color: colors.text }}
            dropdownIconColor={colors.text}  // Android only
          >
            {Object.keys(GOLD_UNIT_MULTIPLIER).map((key) => (
              <Picker.Item key={key} label={key} value={key} color={colors.text} />
            ))}
          </Picker>
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Khối lượng:</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
          keyboardType="numeric"
          placeholder="Nhập số lượng"
          placeholderTextColor={colors.placeholder}
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={[styles.label, { color: colors.text }]}>Ghi chú</Text>
        <TextInput
          placeholder="Ghi chú"
          placeholderTextColor={colors.placeholder}
          value={note}
          onChangeText={setNote}
          style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
        />

        <Text style={[styles.label, { color: colors.text }]}>Số tiền quy đổi:</Text>
        <Text style={[styles.amount, { color: colors.gold}]}>{calculateAmount().toLocaleString()} VND</Text>

        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleAddTransaction}>
          <Text style={[styles.buttonText, { color: colors.textButton }]}>Thêm giao dịch mua</Text>
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
  },
  dateText: {
    fontSize: 16,
  },
  price: {
    fontSize: 18,
    marginVertical: 3,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    fontSize: 16,
  },
   amount: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
