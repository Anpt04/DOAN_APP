import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { getTransactions, Transaction } from '../DB/service/transactionService';

const screenWidth = Dimensions.get('window').width - 40;
const COLORS = ['tomato', 'blue', 'gold', 'green', 'orange', 'purple', 'cyan'];

interface ChartSlice {
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

    // group by category
    const totalsByCat: Record<string, { name: string; amount: number }> = {};
    expenseTx.forEach(tx => {
      if (totalsByCat[tx.category]) {
        totalsByCat[tx.category].amount += tx.amount;
      } else {
        totalsByCat[tx.category] = {
          name: tx.categoryName,
          amount: tx.amount,
        };
      }
    });

    const total = Object.values(totalsByCat).reduce((sum, x) => sum + x.amount, 0);
    setTotalExpense(total);

    const data = Object.values(totalsByCat).map((x, i) => ({
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

  const changeMonth = (direction: 'increase' | 'decrease') => {
    const newMonth = new Date(selectedMonth);
    if (direction === 'increase') {
      newMonth.setMonth(newMonth.getMonth() + 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() - 1);
    }
    setSelectedMonth(newMonth);
    loadData(newMonth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo cáo chi tiêu theo tháng</Text>

      <View style={styles.monthSelection}>
        <TouchableOpacity onPress={() => changeMonth('decrease')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.monthButton} onPress={showDatePicker}>
          <Text style={styles.monthButtonText}>
            {selectedMonth.getMonth() + 1}/{selectedMonth.getFullYear()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeMonth('increase')} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{">"}</Text>
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

      <Text style={styles.totalText}>
        Tổng chi: {totalExpense.toLocaleString()}₫
      </Text>

      {chartData.length > 0 ? (
        <PieChart
          data={chartData.map(s => ({
            name: s.name,
            population: s.value,
            color: s.color,
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
          }))}
          width={screenWidth}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute={false}
          hasLegend={false}
        />
      ) : (
        <Text style={styles.noData}>Không có dữ liệu.</Text>
      )}

      <FlatList
        data={chartData}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.itemText}>
              {item.name}: {item.value.toLocaleString()}₫ (
              {(item.percentage * 100).toFixed(1)}%)
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  monthSelection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  arrowButton: { 
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 10 ,
  },
  arrowText: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  monthButton: {
    borderWidth: 1,
    borderColor: 'rgb(32, 39, 33)',
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center',
    
  },
  monthButtonText: { 
    fontSize: 16 
  },
  totalText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
  },
  chartWrapper: { 
    alignItems: 'center', 
    marginVertical: 10 
  },
  noData: { 
    textAlign: 'center', 
    color: '#666', 
    marginVertical: 20 
  },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 6 
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 4,
  },
  itemText: { 
    fontSize: 14, 
    color: '#333' 
  },
});
