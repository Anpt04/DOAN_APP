import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { router } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { getTransactions, getMonthlyLimits } from '../../DB/service/transactionService';
import { useTheme } from "../../contexts/themeContext";

export function HistoryTransactionScreen() {
  const { theme, toggleTheme, isDark } = useTheme();

  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return formatLocalDate(today);
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(null);

  // Lọc giao dịch theo ngày đã chọn
  const filteredTransactions = transactions.filter((t) => {
    if (!t.date) return false;
    const dateStr = typeof t.date === 'string' ? t.date.slice(0, 10) : t.date.toDate().toISOString().slice(0, 10);
    return dateStr === selectedDate;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Tính tổng thu chi trong tháng
  const getTotalIncomeAndExpenseForMonth = (transactions: any[], month: string) => {
    const monthStart = `${month}-01`;
    const monthEnd = `${month}-31`;

    const filteredTransactionsInMonth = transactions.filter((t) => {
      const transactionDate = t.date.slice(0, 10);
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

  const currentMonth = selectedDate.slice(0, 7);
  const { totalIncomeForMonth, totalExpenseForMonth, totalForMonth } = getTotalIncomeAndExpenseForMonth(transactions, currentMonth);
  const formattedMonth = currentMonth.split("-").reverse().join("-");

  // Cảnh báo khi chi tiêu gần hoặc vượt hạn mức
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setMonthlyLimit(null);
        const data = await getTransactions();
        setTransactions(data);
        const limit = await getMonthlyLimits(selectedDate.slice(0, 7));
        setMonthlyLimit(limit);

        if (limit !== null && totalExpenseForMonth >= limit * 0.9 && totalExpenseForMonth < limit) {
          Alert.alert(
            "Thông báo",
            `Chi tiêu của bạn trong tháng ${formattedMonth} đã gần đạt hạn mức (${totalExpenseForMonth.toLocaleString()}₫ / ${limit.toLocaleString()}₫).`
          );
        } else if (limit !== null && totalExpenseForMonth > limit) {
          Alert.alert(
            "Thông báo",
            `Chi tiêu của bạn trong tháng ${formattedMonth} đã vượt quá hạn mức (${totalExpenseForMonth.toLocaleString()}₫ / ${limit.toLocaleString()}₫).`
          );
        }
      };

      fetchData();
    }, [selectedDate, totalExpenseForMonth])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.calendar}>
        <View style={{ backgroundColor: theme.colors.card, borderRadius: 10, overflow: 'hidden' }}>

        <Calendar
          key={theme.colors.background}
          onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
          onMonthChange={(month: { year: number; month: number }) => {
            const currentDay = parseInt(selectedDate.split('-')[2], 10);
            const newDate = new Date(month.year, month.month - 1, currentDay);
            const newSelectedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
            setSelectedDate(newSelectedDate);
          }}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: theme.colors.primary },
          }}
          theme={{
            calendarBackground: theme.colors.card,
            dayTextColor: theme.colors.text,
            monthTextColor: theme.colors.text,
            arrowColor: theme.colors.text,
            todayTextColor: theme.colors.primary,
          }}
        />
        </View>
      </View>

      <View style={[styles.summaryMonthContainer, { backgroundColor: theme.colors.card }]}>
        <View style={styles.summaryMonth}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.summaryTextMonth, { color: theme.colors.incomText }]}>Thu: {totalIncomeForMonth.toLocaleString()}đ</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.summaryTextMonth, { color: theme.colors.expenseText }]}>Chi: {totalExpenseForMonth.toLocaleString()}đ</Text>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.summaryTextMonth, { color: theme.colors.text }]}>Tổng: {totalForMonth.toLocaleString()}đ</Text>
        </View>
      </View>

      <View style={[styles.summary, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.summaryText, { color:  theme.colors.incomText }]}>Tiền thu ngày: {totalIncome.toLocaleString()}đ</Text>
        <Text style={[styles.summaryText, { color: theme.colors.expenseText }]}>Tiền chi ngày: {totalExpense.toLocaleString()}đ</Text>
        <Text style={[styles.summaryText, { color: theme.colors.text }]}>Tổng ngày: {(totalIncome - totalExpense).toLocaleString()}đ</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (item.category === 'buyGold' || item.category === 'sellGold') {
                  Alert.alert('Không thể chỉnh sửa', 'Bạn không thể chỉnh sửa giao dịch vàng.', [{ text: 'OK' }]);
                  return;
                }
                router.push({ pathname: '/screen/transaction/editTransactionScreen', params: { id: item.id } });
              }}
            >
              <View style={[styles.item, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.itemText, { color: theme.colors.text }]}>{item.categoryName}</Text>
                <Text style={[styles.itemAmount, { color: item.type === 'income' ? theme.colors.incomText : theme.colors.expenseText }]}>
                  {item.amount.toLocaleString()}đ
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: theme.colors.placeholder, textAlign: 'center', marginTop: 20 }}>
            Không có giao dịch trong ngày
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    width: '100%',
    padding: 10,
    flexGrow: 1,
    borderRadius: 10,
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  summaryMonth: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryMonthContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 15,
    padding: 3,
  },
  summaryTextMonth: {
    fontSize: 16,
    margin: 3,
  },
  summary: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
  },
  itemAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HistoryTransactionScreen; 