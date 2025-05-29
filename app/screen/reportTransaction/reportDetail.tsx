import { View, Text, Dimensions, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { router } from 'expo-router';
import { getTransactionsByCategory } from "@/app/DB/service/transactionService";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "../../contexts/themeContext"; 
import type { Transaction } from "../../DB/LocalDB/localService";

const screenWidth = Dimensions.get("window").width - 20;

export default function ReportDetailScreen() {
  const { id, month } = useLocalSearchParams<{ id: string; month: string }>();
  const [dataPerMonth, setDataPerMonth] = useState<{ month: string; amount: number }[]>([]);
  const [txList, setTxList] = useState<Transaction[]>([]);
  const currentMonth = month ? parseInt(month.split("-")[1], 10) : new Date().getMonth() + 1;

  const { theme } = useTheme(); // sử dụng theme từ context

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const allTx = await getTransactionsByCategory(id);

      const totalsByMonth: Record<string, number> = {};
      allTx.forEach(tx => {
        const ym = tx.date.slice(0, 7);
        totalsByMonth[ym] = (totalsByMonth[ym] || 0) + tx.amount;
      });
      const year = month ? parseInt(month.split("-")[0], 10) : new Date().getFullYear();
      let monthNums: number[] = [];
      if (currentMonth <= 4) monthNums = [1, 2, 3, 4];
      else if (currentMonth <= 8) monthNums = [5, 6, 7, 8];
      else monthNums = [9, 10, 11, 12];
      setDataPerMonth(
        monthNums.map(m => {
          const mm = String(m).padStart(2, "0");
          return { month: `${year}-${mm}`, amount: totalsByMonth[`${year}-${mm}`] || 0 };
        })
      );

      if (month) {
        setTxList(allTx.filter(tx => tx.date.slice(0, 7) === month));
      } else {
        setTxList(allTx);
      }
    };
    fetchData();
  }, [id, month]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: theme.colors.background },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: theme.colors.text },
    subTitle: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8, color: theme.colors.text },
    txItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    txLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    txDate: { fontSize: 14, color: theme.colors.text },
    txName: { fontSize: 16, fontWeight: "500", marginLeft: 8, color: theme.colors.text },
    txAmount: { fontSize: 14, fontWeight: "500", color: theme.colors.text },
    noData: { textAlign: "center", color: theme.colors.placeholder, marginTop: 10 },
  }), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo cáo chi tiêu tháng {month}</Text>

      <BarChart
        style={{ borderRadius: 16 }}
        data={{
          labels: dataPerMonth.map(d => d.month.slice(5) + "/" + d.month.slice(0, 4)),
          datasets: [
            {
              data: dataPerMonth.map(d => d.amount),
              colors: dataPerMonth.map(d => {
                const m = parseInt(d.month.slice(5, 7), 10);
                return (opacity = 1) =>
                  m === currentMonth
                    ? `rgba(255,99,132,${opacity})`
                    : `rgba(0,123,255,${opacity})`;
              }),
            },
          ],
        }}
        width={screenWidth}
        height={220}
        fromZero
        showValuesOnTopOfBars
        withCustomBarColorFromData
        flatColor
        yAxisLabel="₫"
        yAxisSuffix="" 
        chartConfig={{
          backgroundGradientFrom: theme.colors.background,
          backgroundGradientTo: theme.colors.background,
          decimalPlaces: 0,
          color: (opacity = 1) =>  theme.colors.text,
          labelColor: (opacity = 1) => theme.colors.text,
          style: { borderRadius: 16 },
        }}
      />


      <Text style={styles.subTitle}>Chi tiết giao dịch</Text>
      <FlatList
        data={txList}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} onPress={() => {
            if (item.category === 'buyGold' || item.category === 'sellGold') {
              Alert.alert(
                'Không thể chỉnh sửa',
                'Bạn không thể chỉnh sửa giao dịch vàng.',
                [{ text: 'OK' }]
              );
              return;
            }
            router.push({ pathname: '/screen/transaction/editTransactionScreen', params: { id: item.id } });
          }}>
            <View style={styles.txItem}>
              <View style={styles.txLeft}>
                <Text style={styles.txDate}>{item.date}</Text>
                <Text style={styles.txName}>{item.categoryName}</Text>
              </View>
              <Text style={styles.txAmount}>{item.amount.toLocaleString()}₫</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noData}>Không có giao dịch.</Text>}
      />
    </View>
  );
}
