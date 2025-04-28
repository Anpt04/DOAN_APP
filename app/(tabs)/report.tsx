import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import TabSwitcher from '../../components/TabSwitcher';
import ExpensePage from '../screen/reportTransaction/reportExpenseScreen';
import IncomePage from '../screen/reportTransaction/reportIncomescreen';

export default function goldTransactionScreen() {
  const [currentPage, setCurrentPage] = useState("ExpensePage");
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
