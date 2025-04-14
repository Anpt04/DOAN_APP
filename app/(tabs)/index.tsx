import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import TabSwitcher from '../../components/TabSwitcher'; // Giả lập component ToggleTabs
import ExpensePage from '../screen/expenseScreen';
import IncomePage from '../screen/incomeScreen'; 


export default function App() {
  const [currentPage, setCurrentPage] = useState("ExpensePage");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TabSwitcher currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === "ExpensePage" ? <ExpensePage /> : <IncomePage />}
    </View>
  );
}
