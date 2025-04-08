import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { addTransaction } from "../DB/transactionService";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../DB/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const AddTransactionScreen: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string; type: 'expense' }[]>(
    []
  );

  // Lấy userId hiện tại và categories từ Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const catRef = collection(db, "users", userId, "categories");
        const snapshot = await getDocs(catRef);
        const catList = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          type: doc.data().type,
        }));
        setCategories(catList);
        if (catList.length > 0) {
          setCategory(catList[0].id); // Set giá trị mặc định
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    const transaction = {
      type : "expense",
      category,
      amount: parseFloat(amount.toString()),
      date: new Date().toISOString(),
      note,
    };
    await addTransaction(transaction);
    setAmount(0);
    setNote("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm giao dịch</Text>
      <TextInput
        placeholder="Số tiền"
        keyboardType="number-pad"
        value={amount === 0 || isNaN(amount) ? "" : amount.toString()}
        onChangeText={(text) => {
          const newAmount = parseFloat(text);
          setAmount(isNaN(newAmount) ? 0 : newAmount);
        }}
        style={styles.input}
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.input}
      >
        
        {categories
        .filter((cat) => cat.type === "expense")
        .map((cat) => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
        ))}
      </Picker>
      <TextInput
        placeholder="Ghi chú"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />
      <Button title="Thêm giao dịch" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
    backgroundColor: "rgb(255, 255, 255)",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "rgb(1,1,1)",
  },
});

export default AddTransactionScreen;
