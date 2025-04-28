import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import TabSwitcher from '../../components/TabSwitcher';
import ExpensePage from '../screen/gold/buyGold';
import IncomePage from '../screen/gold/sellGold';

export default function goldTransactionScreen() {
  const [currentPage, setCurrentPage] = useState("ExpensePage");
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TabSwitcher
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        tabLabels={{ left: "Mua vàng", right: "Bán vàng" }}
        tabKeys={{ left: "ExpensePage", right: "IncomePage" }}
      />
      {currentPage === "ExpensePage" ? <ExpensePage /> : <IncomePage />}
    </View>
  );
}
