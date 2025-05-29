const baseFontStyle = {
  fontFamily: 'System', // hoặc 'SpaceMono' nếu bạn đang dùng font custom
  fontWeight: 'normal' as const,
};

export const lightTheme = {
  dark: false,
  colors: {
    background: '#ffffff',
    text: 'rgb(0, 0, 0)',
    primary: '#4caf50',
    card: '#f9f9f9',
    border: '#dcdcdc',
    notification: '#ff453a',
    inputBackground: "#f2f2f2",
    placeholder: "#888",
    textButton: "rgb(255, 255, 255)",
    incomText: 'rgb(24, 39, 245)',
    expenseText: 'rgb(245, 30, 30)',
    danger: "#f44336",
    gold: "#4caf50", 
    backgroundTitle: 'rgb(240, 240, 240)',
    tint: '#4caf50',           // Màu chính để highlight (dùng tabBarActiveTintColor...)
    tabBarBackground: '#ffffff', // Nền tab bar
    tabBarIconInactive: 'rgb(51, 51, 51)', // Màu icon tab không active
    shadow: 'rgba(0,0,0,0.1)',  // Màu shadow/đổ bóng
    link: 'rgb(0, 122, 255)', // Màu link
  },
  fonts: {
    regular: baseFontStyle,
    medium: baseFontStyle,
    bold: baseFontStyle,
    heavy: baseFontStyle,
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    background: 'rgb(54, 54, 54)',
    text: 'rgb(255, 255, 255)',
    primary: 'rgb(85, 87, 85)', 
    card: '#1c1c1e',
    border: '#3a3a3c',
    notification: '#ff453a',
    inputBackground: "#1e1e1e",
    placeholder: "#aaa",
    textButton: "rgb(255, 255, 255)",
    incomText: 'rgb(94, 226, 127)',
    expenseText: 'rgb(255, 89, 89)',
    danger: "#e57373",
    gold: "rgb(255, 215, 0)", 
    backgroundTitle: 'rgb(44, 44, 44)', 
    tint: 'rgb(74, 231, 74)',        // Màu chính để highlight
    tabBarBackground: 'rgb(30,30,30)', // Nền tab bar tối
    tabBarIconInactive: '#888888',   // Màu icon tab không active
    shadow: 'rgba(0,0,0,0.5)',        // Màu shadow đậm hơn
    link: 'rgb(10, 132, 255)', // Màu link
  },
  fonts: {
    regular: baseFontStyle,
    medium: baseFontStyle,
    bold: baseFontStyle,
    heavy: baseFontStyle,
  },
};


