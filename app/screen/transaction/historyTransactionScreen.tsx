import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { getTransactions, getMonthlyLimits } from '../../DB/service/transactionService'; // Thêm hàm getMonthlyLimits

export function HistoryTransactionScreen() {
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
  const [monthlyLimit, setMonthlyLimit] = useState<number | null>(null); // Thêm trạng thái cho hạn mức

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await getTransactions();
        setTransactions(data);

        // Lấy hạn mức chi tiêu từ cơ sở dữ liệu
        const limit = await getMonthlyLimits(selectedDate.slice(0, 7)); // Lấy hạn mức của tháng hiện tại
        setMonthlyLimit(limit);
      };
      fetchData();
    }, [selectedDate]) // Cập nhật khi selectedDate thay đổi
  );

  // Tính tổng tiền thu và chi theo ngày
  const filteredTransactions = transactions.filter((t) => {
    if (!t.date) return false;

    // Kiểm tra và chuyển đổi ngày về định dạng yyyy-MM-dd
    const dateStr = typeof t.date === 'string' ? t.date.slice(0, 10) : t.date.toDate().toISOString().slice(0, 10);
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

  // Kiểm tra và hiển thị thông báo khi chi tiêu gần đạt hạn mức
  React.useEffect(() => {
    if (monthlyLimit !== null && totalExpenseForMonth >= monthlyLimit * 0.9) {
      Alert.alert(
        "Thông báo",
        `Chi tiêu của bạn trong tháng này đã gần đạt hạn mức (${totalExpenseForMonth.toLocaleString()}₫ / ${monthlyLimit.toLocaleString()}₫).`
      );
    }
  }, [monthlyLimit, totalExpenseForMonth]);

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <Calendar
          onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
          onMonthChange={(month: { year: number; month: number }) => {
            const currentDay = parseInt(selectedDate.split('-')[2], 10);
            const newDate = new Date(month.year, month.month - 1, currentDay);
        
            const newSelectedDate = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
            setSelectedDate(newSelectedDate);
          }}
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
      <View style={styles.summaryMonthContainer}>
        <View style={styles.summaryMonth}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.summaryTextMonth, { color: 'skyblue' }]}>Thu:  {totalIncomeForMonth.toLocaleString()}đ</Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.summaryTextMonth, { color: 'orange' }]}>Chi: {totalExpenseForMonth.toLocaleString()}đ</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.summaryTextMonth, { color: 'white' }]}>Tổng: {totalForMonth.toLocaleString()}đ</Text>
        </View>
      </View>

      {/* Tổng tiền thu và chi theo ngày */}
      <View style={styles.summary}>
        <Text style={[styles.summaryText, { color: 'skyblue' }]}>Tiền thu ngày: {totalIncome.toLocaleString()}đ</Text>
        <Text style={[styles.summaryText, { color: 'orange' }]}>Tiền chi ngày: {totalExpense.toLocaleString()}đ</Text>
        <Text style={[styles.summaryText, { color: 'white' }]}>Tổng ngày: {(totalIncome - totalExpense).toLocaleString()}đ</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}> 
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => {
              if (item.category === 'buyGold' || item.category === 'sellGold') {
                Alert.alert(
                  'Không thể chỉnh sửa',
                  'Bạn không thể chỉnh sửa giao dịch vàng.',
                  [{ text: 'OK' }]
                );
                return;
              }
              router.push({ pathname: '/screen/transaction/editTransactionScreen', params: { id: item.id } })}}>
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.categoryName}</Text>
                <Text style={[styles.itemAmount, { color: item.type === 'income' ? 'skyblue' : 'orange' }]}>
                  {item.amount.toLocaleString()}đ
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
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
    backgroundColor: 'rgb(117, 117, 117)',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: 'rgb(117, 117, 117)',
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
    backgroundColor: 'rgb(32, 32, 32)',
    borderRadius: 10,
    marginBottom:15,
    padding: 3,
  },
  summaryTextMonth: {
    fontSize: 16,
    margin: 3,
  },
  summary: {
    marginBottom: 15,
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

export default HistoryTransactionScreen;
