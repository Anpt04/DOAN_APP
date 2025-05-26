import React, { useState, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { getTransactions, Transaction } from '../../DB/service/transactionService';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
const screenWidth = Dimensions.get('window').width - 40;
const COLORS = ['rgba(238, 137, 137, 0.72)', 'blue', 'gold', 'green', 'orange', 'purple', 'cyan'];

interface ChartSlice {
  id: string;
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export default function ReportScreen() {
  const [chartData, setChartData] = useState<ChartSlice[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    hideDatePicker();
    setSelectedMonth(date);
    loadData(date);
  };

  const loadData = useCallback(async (monthDate: Date) => {
    const m = monthDate.toISOString().slice(0, 7); // 'YYYY-MM'
    const allTx: Transaction[] = await getTransactions();
    const expenseTx = allTx.filter(
      tx => tx.type === 'expense' && tx.date.slice(0, 7) === m
    );

    const totalsByCat: Record<string, { id: string; name: string; amount: number }> = {};
    expenseTx.forEach(tx => {
      if (totalsByCat[tx.category]) {
        totalsByCat[tx.category].amount += tx.amount;
      } else {
        totalsByCat[tx.category] = {
          id: tx.category,
          name: tx.categoryName,
          amount: tx.amount,
        };
      }
    });

    const total = Object.values(totalsByCat).reduce((sum, x) => sum + x.amount, 0);
    setTotalExpense(total);

    const data = Object.values(totalsByCat).map((x, i) => ({
      id: x.id,
      name: x.name,
      value: x.amount,
      color: COLORS[i % COLORS.length],
      percentage: total > 0 ? x.amount / total : 0,
    }));
    setChartData(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData(selectedMonth);
    }, [loadData, selectedMonth])
  );

  const changeMonth = (dir: 'prev' | 'next') => {
    const d = new Date(selectedMonth);
    d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1));
    setSelectedMonth(d);
    loadData(d);
  };

  // kích thước chart và lỗ giữa
  const chartSize = screenWidth;
  const holeSize = chartSize * 0.5;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo cáo chi tiêu theo tháng</Text>

      <View style={styles.monthSelection}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.arrowButton}>
          <AntDesign name="caretleft" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.monthButton} onPress={showDatePicker}>
          <Text style={styles.monthButtonText}>
            {selectedMonth.getMonth() + 1}/{selectedMonth.getFullYear()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.arrowButton}>
          <AntDesign name="caretright" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
        display="spinner"
      />

      <Text style={styles.totalText}>Tổng chi: {totalExpense.toLocaleString()}₫</Text>

      {chartData.length > 0 ? (
        <View style={[styles.chartWrapper, { width: chartSize, height: chartSize }]}>
          <PieChart
            data={chartData.map(s => ({
              name: s.name,
              population: s.value,
              color: s.color,
              legendFontColor: '#7F7F7F',
              legendFontSize: 12,
            }))}
            width={chartSize}
            height={chartSize}
            chartConfig={{ color: (opacity = 1) => `rgba(0,0,0,${opacity})` }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="90"
            hasLegend={false}
            absolute={false}
          />
          {/* Lỗ trắng giữa doughnut */}
          <View
            style={[
              styles.hole,
              { width: holeSize, height: holeSize, borderRadius: holeSize / 2 },
            ]}
          />
        </View>
      ) : (
        <Text style={styles.noData}>Chưa có khoản chi trong tháng này.</Text>
      )}

      <FlatList
        data={chartData}
        keyExtractor={item => `${item.id}-${item.name}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              router.push({
                pathname: '/screen/reportTransaction/reportDetail',
                params: {
                  id: item.id,
                  month: selectedMonth.toISOString().slice(0, 7), // gửi tháng dưới dạng 'YYYY-MM'
                },
              });
            }}
          >
            <View style={styles.item}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text style={styles.itemText}>
                {item.name}: {item.value.toLocaleString()}₫ ({(item.percentage * 100).toFixed(1)}%)
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  monthSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  arrowButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthButton: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
  },
  monthButtonText: {
    fontSize: 16,
  },
  totalText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
  chartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 5,
  },
  hole: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  colorBox: {
    width: 25,
    height: 25,
    marginRight: 8,
    borderRadius: 4,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});
