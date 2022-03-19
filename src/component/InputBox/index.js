import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {t} from 'react-native-tailwindcss';

export default function Input(props) {
  const {onChangeText, value, placeholder, label} = props;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}:</Text>
      <View style={styles.inputField}>
        <TextInput
          style={[
            styles.input,
            props.error && t.borderRed500,
            props.style,
            {borderRadius: 10},
          ]}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
        />
        <Text>
          {props.errorText && (
            <Text style={styles.errorText}>{props.errorText}</Text>
          )}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  wrapper: [
    t.selfStretch,
    t.mB5,
    t.flexRow,
    t.flex,
    t.wFull,
    t.itemsCenter,
    t.h8,
  ],
  input: [
    t.h8,
    t.border,
    t.selfStretch,
    t.p2,
    t.borderGray500,

    t.textBase,
    t.textGray700,
  ],
  errorText: [t.mT1, t.textRed500],
  label: [t.w1_4, t.mB4],
  inputField: [t.w3_4, t.pL3],
};
