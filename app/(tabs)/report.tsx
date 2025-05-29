import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import TabSwitcher from '../../components/TabSwitcher';
import ExpensePage from '../screen/reportTransaction/reportExpenseScreen';
import IncomePage from '../screen/reportTransaction/reportIncomescreen';
import { useTheme } from "../contexts/themeContext";

export default function goldTransactionScreen() {
  const [currentPage, setCurrentPage] = useState("ExpensePage");
  const { theme } = useTheme();
  
  return (
    <View style={[{ flex: 1 },  { backgroundColor: theme.colors.background } ]}>
      <TabSwitcher
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        tabLabels={{ left: "Chi", right: "Thu" }}
        tabKeys={{ left: "ExpensePage", right: "IncomePage" }}
      />
      {currentPage === "ExpensePage" ? <ExpensePage /> : <IncomePage />}
    </View>
  );
}
