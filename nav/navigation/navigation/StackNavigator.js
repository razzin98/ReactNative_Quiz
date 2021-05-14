import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "../screens/Main";
import Exam from "../screens/Exam";
import Result from "../screens/Result";
import ExamResults from "../screens/ExamResults";
const Stack = createStackNavigator();
const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "darkgray",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};
const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Exam" component={Exam} />
      <Stack.Screen name="Result" component={Result} />
	  <Stack.Screen name="ExamResults" component={ExamResults} />
    </Stack.Navigator>
  );
};
const ResultStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Result" component={Result} />
    </Stack.Navigator>
  );
};
const ExamStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Exam" component={Exam} />
    </Stack.Navigator>
  );
};
const ExamResultsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="ExamResults" component={ExamResults} />
    </Stack.Navigator>
  );
};
export { MainStackNavigator, ResultStackNavigator, ExamStackNavigator, ExamResultsStackNavigator };