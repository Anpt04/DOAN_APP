import React, { useState } from 'react';
import { View, Button, Platform, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TimePickerExample() {
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedTime?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Giờ đã chọn: {time.toLocaleTimeString()}</Text>

      <Button title="Chọn giờ" onPress={() => setShow(true)} />

      {show && (
        <DateTimePicker
          value={time}
          mode="date"           // 👈 chọn thời gian
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}
