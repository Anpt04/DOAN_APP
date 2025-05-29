import React, { useState, useCallback } from 'react';
import {
  View, Text, Dimensions, StyleSheet,
  FlatList, TouchableOpacity
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { getTransactions, Transaction } from '../../DB/service/transactionService';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useTheme } from '../../contexts/themeContext'; // ✅ Sử dụng theme context

const screenWidth = Dimensions.get('window').width - 40;

interface ChartSlice {
  id: string;
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export default function ReportScreen() {
  const { theme } = useTheme(); // ✅ Dùng theme hiện tại
  const [chartData, setChartData] = useState<ChartSlice[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

 const COLORS = ['rgb(110, 211, 64)', 'rgb(55, 211, 231)', 'rgb(132, 27, 231)', 'rgb(204, 81, 235)', 'rgb(55, 211, 231)', 'rgb(240, 81, 81)', 'rgb(77, 231, 103)'];

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    hideDatePicker();
    setSelectedMonth(date);
    loadData(date);
  };

  const loadData = useCallback(async (monthDate: Date) => {
    const m = monthDate.toISOString().slice(0, 7);
    const allTx: Transaction[] = await getTransactions();
    const expenseTx = allTx.filter(
      tx => tx.type === 'income' && tx.date.slice(0, 7) === m
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
  }, [COLORS]);

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

  const chartSize = screenWidth;
  const holeSize = chartSize * 0.5;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Báo cáo chi tiêu theo tháng</Text>

      <View style={styles.monthSelection}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.arrowButton}>
          <AntDesign name="caretleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.monthButton, { borderColor: theme.colors.border }]} onPress={showDatePicker}>
          <Text style={[styles.monthButtonText, { color: theme.colors.text }]}>
            {selectedMonth.getMonth() + 1}/{selectedMonth.getFullYear()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.arrowButton}>
          <AntDesign name="caretright" size={24} color={theme.colors.text} />
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

      <Text style={[styles.totalText, { color: theme.colors.incomText }]}>
        Tổng thu: {totalExpense.toLocaleString()}₫
      </Text>

      {chartData.length > 0 ? (
        <View style={[styles.chartWrapper, { width: chartSize, height: chartSize }]}>
          <PieChart
            data={chartData.map(s => ({
              name: s.name,
              population: s.value,
              color: s.color,
              legendFontColor: theme.colors.text,
              legendFontSize: 12,
            }))}
            width={chartSize}
            height={chartSize}
            chartConfig={{ color: () => theme.colors.text }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="90"
            hasLegend={false}
            absolute={false}
          />
          <View
            style={[
              styles.hole1,
              {
                width: holeSize,
                height: holeSize,
                borderRadius: holeSize / 2,
                backgroundColor: theme.colors.background,
                borderWidth: 2,
                borderColor: theme.colors.border,
              },
            ]}/>
          <View
            style={[
              styles.hole,
              {
                width: holeSize,
                height: holeSize,
                borderRadius: holeSize / 2,
                backgroundColor: theme.colors.background,
              },
            ]}
          />
        </View>
      ) : (
        <Text style={[styles.noData, { color: theme.colors.placeholder }]}>
          Chưa có khoản thu trong tháng này.
        </Text>
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
                  month: selectedMonth.toISOString().slice(0, 7),
                },
              });
            }}
          >
            <View style={styles.item}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text style={[styles.itemText, { color: theme.colors.text }]}>
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
  monthButton: {
    borderWidth: 1,
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
  },
  hole1: {
    backgroundColor: 'rgb(255, 255, 255)',
    position: 'absolute',

  },
  noData: {
    textAlign: 'center',
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
    fontWeight: '500',
  },
});
