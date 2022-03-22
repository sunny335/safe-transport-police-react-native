import React from 'react';
import {View, Text, TextInput, Dimensions} from 'react-native';
import {t} from 'react-native-tailwindcss';

const WIDTH = Dimensions.get('window').width;
export default function Input(props) {
  const {
    onChangeText,
    value,
    placeholder,
    type,
    secureTextEntry = false,
  } = props;
  return (
    <View style={styles.wrapper}>
      <View style={{width: WIDTH - 105}}>
        <TextInput
          style={[styles.input, props.error && t.borderRed500, props.style]}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          type={type}
          secureTextEntry={secureTextEntry}
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
    t.pYPx,
    t.borderGray500,
    t.roundedFull,
    t.textBase,
    t.textGray700,
    t.shadowMd,
    t.bgWhite,
    t.pX4,
  ],
  errorText: [t.mT1, t.textRed500],
  label: [t.w1_4, t.mB4],
};
