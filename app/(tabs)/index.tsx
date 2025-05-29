import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import TabSwitcher from '../../components/TabSwitcher';
import ExpensePage from '../screen/transaction/expenseScreen';
import IncomePage from '../screen/transaction/incomeScreen';
import { useTheme } from "../contexts/themeContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState("ExpensePage");
  const { theme } = useTheme();
  
  return (
    <View style={[{ flex: 1 },  { backgroundColor: theme.colors.background } ]}>
      <TabSwitcher
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        tabLabels={{ left: "Tiền chi", right: "Tiền thu" }}
        tabKeys={{ left: "ExpensePage", right: "IncomePage" }}
      />
      {currentPage === "ExpensePage" ? <ExpensePage /> : <IncomePage />}
    </View>
  );
}
