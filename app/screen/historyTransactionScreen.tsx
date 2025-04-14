import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getTransactionsFromCloud } from '../DB/firebase/firebaseService';

export function TransactionScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Chọn ngày mặc định là hôm nay
  });  
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTransactionsFromCloud();
      setTransactions(data);
    };
    fetchData();
  }, []);

  // Tính tổng tiền thu và chi theo ngày
  const filteredTransactions = transactions.filter((t) => {
    if (!t.date) return false;
    const dateStr = typeof t.date === 'string'
      ? t.date.slice(0, 10)
      : t.date.toDate().toISOString().slice(0, 10);
    return dateStr === selectedDate;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Hàm tính tổng tiền thu và chi trong tháng
  const getTotalIncomeAndExpenseForMonth = (transactions: any[], month: string) => {
    const monthStart = `${month}-01`;
    const monthEnd = `${month}-31`; // Tạo chuỗi ngày cuối tháng

    const filteredTransactionsInMonth = transactions.filter((t) => {
      const transactionDate = t.date.slice(0, 10); // Lấy ngày giao dịch
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const totalIncomeForMonth = filteredTransactionsInMonth
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenseForMonth = filteredTransactionsInMonth
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalForMonth = totalIncomeForMonth - totalExpenseForMonth;

    return { totalIncomeForMonth, totalExpenseForMonth, totalForMonth };
  };

  const currentMonth = selectedDate.slice(0, 7); // Lấy phần năm-tháng từ selectedDate
  const { totalIncomeForMonth, totalExpenseForMonth, totalForMonth } = getTotalIncomeAndExpenseForMonth(transactions, currentMonth);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.calendar}>
        <Calendar
          onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: '#f06292' },
          }}
          theme={{
            calendarBackground: 'rgb(83, 119, 173)',
            dayTextColor: '#fff',
            monthTextColor: '#fff',
            arrowColor: '#f06292',
          }}
        />
      </View>

      {/* Tổng tiền thu và chi theo tháng */}
      <View style={styles.summaryMonth}>
        <Text style={[styles.summaryTextMonth, { color: 'skyblue' }]}>Thu: {totalIncomeForMonth.toLocaleString()}đ</Text>
        <Text style={[styles.summaryTextMonth, { color: 'orange' }]}>Chi: {totalExpenseForMonth.toLocaleString()}đ</Text>
        <Text style={[styles.summaryTextMonth, { color: 'white' }]}>Tổng: {totalForMonth.toLocaleString()}đ</Text>
      </View>

      {/* Tổng tiền thu và chi theo ngày */}
      <View style={styles.summary}>
        <Text style={[styles.summaryText, { color: 'skyblue' }]}>Tiền thu ngày: {totalIncome.toLocaleString()}đ</Text>
        <Text style={[styles.summaryText, { color: 'orange' }]}>Tiền chi ngày: {totalExpense.toLocaleString()}đ</Text>
        <Text style={[styles.summaryText, { color: 'white' }]}>Tổng ngày: {(totalIncome - totalExpense).toLocaleString()}đ</Text>
      </View>

      {filteredTransactions.length > 0 ? (
        filteredTransactions.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemText}>{item.categoryName || 'Không rõ'}</Text>
            <Text style={[styles.itemAmount, { color: item.type === 'income' ? 'skyblue' : 'orange' }]}>
              {item.amount.toLocaleString()}đ
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
          Không có giao dịch trong ngày
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
    summaryMonth: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgb(32, 32, 32)',
        borderRadius: 10,
        margin:5,
        padding: 10,
    },
    summaryTextMonth: {
        fontSize: 16,
        margin: 5,
    },
  summary: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
  itemAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TransactionScreen;
