import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import TabSwitcher from '../../components/TabSwitcher';
import BuyGold from '../screen/gold/buyGold';
import SellGold from '../screen/gold/sellGold';
import { useTheme } from "../contexts/themeContext";

export default function goldTransactionScreen() {
  const [currentPage, setCurrentPage] = useState("ExpensePage");
  const { theme } = useTheme();
  
  return (
    <View style={[{ flex: 1 },  { backgroundColor: theme.colors.background } ]}>      
      <TabSwitcher
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        tabLabels={{ left: "Mua vàng", right: "Bán vàng" }}
        tabKeys={{ left: "ExpensePage", right: "IncomePage" }}
      />
      {currentPage === "ExpensePage" ? <BuyGold /> : <SellGold />}
    </View>
  );
}
