// components/ToggleTabs.tsx
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

type Props = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  tabLabels: {
    left: string;
    right: string;
  };
  tabKeys: {
    left: string;
    right: string;
  };
};


const TabSwitcher: React.FC<Props> = ({ currentPage, setCurrentPage, tabLabels, tabKeys }) => {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => setCurrentPage("ExpensePage")}
        style={[
          styles.button,
          styles.leftButton,
          currentPage === "ExpensePage" && styles.activeButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            currentPage === "ExpensePage" && styles.activeButtonText,
          ]}
        >
          {tabLabels.left}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setCurrentPage("IncomePage")}
        style={[
          styles.button,
          styles.rightButton,
          currentPage === "IncomePage" && styles.activeButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            currentPage === "IncomePage" && styles.activeButtonText,
          ]}
        >
          {tabLabels.right}
          </Text>
      </Pressable>
    </View>
  );
};

export default TabSwitcher;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 60,
    backgroundColor: "rgb(87, 87, 87)",
    borderRadius: 10,
    padding: 2,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "rgb(87, 87, 87)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: "rgb(250, 246, 246)",
    fontSize: 16,
    fontWeight: "bold",
  },
  activeButton: {
    backgroundColor: "white",
  },
  activeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  leftButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
