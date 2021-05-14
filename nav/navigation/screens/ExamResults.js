import React, { Component, PropTypes } from "react";
import {Modal,View,Text,TouchableHighlight,TouchableOpacity} from "react-native";
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXAM_1, EXAM_2 } from "../screens/exams_data/Exam01";

import NavigationActions from '@react-navigation/native';
import StackActions from '@react-navigation/native';

export default class ExamResults extends Component<Props> {

	constructor({props,route}) {
    super(props,route);
	this.state = {
		points:route.params.point,
		total:route.params.total,};
	}
  componentDidMount() {
    
  }

  render() { 
	const { navigation } = this.props;
	const finishQuiz = () => {
	this.props.navigation.reset({
     index: 1,
     routes: [{ name: 'Main' }]
	})
	}
    return (
      <View style={styles.container}>
        <Text style={styles.item}>Your score: {this.state.points}/{this.state.total} points.</Text>
		<TouchableOpacity onPress={() => {finishQuiz()}} style={styles.button}>
            <Text>Return to main page.</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkgray',
	alignItems: 'center',
  },
  item: {
	marginTop:50,
    backgroundColor: 'gray',
    paddingTop: 50,
    paddingBottom: 50,
	padding:10,
	flexDirection: 'row',
	borderWidth: 1,
    borderColor: '#434343',
	fontSize:20,
  },
  button:{
	padding:10,
	width:225,
    backgroundColor: 'darkgray',
	alignItems: 'center',
	borderWidth: 1,
    borderColor: '#434343',
  },
});