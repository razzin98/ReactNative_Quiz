import React, {Component} from 'react';
import { useState } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView,  FlatList, StatusBar } from 'react-native';
import { EXAM_1, EXAM_2 } from "../screens/exams_data/Exam01";
import AsyncStorage from '@react-native-async-storage/async-storage';

import QuizStorage from '../QuizStorage'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: "baza.db", createFromLocation: 1});

let count=0,points=0;
type Props = {};
var questions =[];
const user="AK";

export default class Exam extends Component<Props> {
	constructor({props,route}) {
    super(props);

	this.state = {
		exam:EXAM_1,
	  question:'',
	  question_id:0,
		answer_1:'',
		answer_2:'',
		answer_3:'',
		answer_4:' ',
		answers:[],
		exam_id:route.params.exam,
		exam_name:route.params.name,
		size:route.params.size,
		exam_tag:route.params.tag,
    };
	this.getQuestion();
	
  }
  
  getQuestion = () => {
  db.transaction(tx => {
      tx.executeSql(`SELECT * FROM Questions WHERE  test_id=?  ORDER BY id`, [this.state.exam_id], (tx, results) => {
        var temp = [];
		
		for(let i=0;i<results.rows.length;i++){
			temp.push(results.rows.item(i));
		}
        QuizStorage.setQID(temp[0].id);
		
		questions = temp;
        this.setState({
          question: questions[0].name,
		  question_id:questions[0].id,
		  
        });
        console.log("question:  "+this.state.question_id);
      },
			(error) => {
				console.log("Error fetching the data from the database "+error.message);
			});
    });
    
		
  }
  nextQuestion = () => {
	  this.setState({
          question: questions[count].name,
		  question_id:questions[count].id,
        });
		this.getAnswers();
  }
  
  
  getAnswers = () => {
	  db.transaction(tx => {
      tx.executeSql(`SELECT * FROM Answers WHERE question_id=? `, [this.state.question_id], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          console.log('ANSWER',temp[i]);
        }
        this.setState({
		  answer_1:temp[0],
		  answer_2:temp[1],
		  answer_3:temp[2],
		  answer_4:temp[3],
		  answers:temp,
        },
      ),this.shuffleDeck(this.state.answers);
      });
    });
  }
  
  componentDidMount() {
	  console.log("Uruchamiam test o nazwie: "+this.state.exam_name);
		this.getAnswers();
  }
	
	sendResult(points,total,type){
			return(
				fetch('http://tgryl.pl/quiz/result', {
			  method: 'POST',
			  headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({
				"nick": user,
				"score": points,
				"total": total,
				"type": type,
			  })
			})
			);
	}
	
	shuffleDeck = (array) => {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
	};
	
	operation = ({ navigation }, answer) => {
	if(answer.is_true=="true"){
			console.log("That's correct!");
			points++;
		}
    if(count==this.state.size-1){
		AsyncStorage.setItem("klucz", JSON.stringify(points), (err,result) => {
            console.log("error",err,"result",result);
            });
		console.log("zakończono test");
		{this.sendResult(points,count+1,this.state.exam_tag)}
		this.props.navigation.navigate("ExamResults",
			{point:points,
			total:count+1,});
		count=0,points=0;
	} 
	else{
		
		count++;
		this.nextQuestion();
	}
	}

  render() {
	  const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
			<View style={styles.question}>
			<Text style={{fontFamily: "righteous-regular"}}>{this.state.question+"\n"}</Text>
			<FlatList
					data={this.state.answers}
					renderItem={({item}) => (
						<View>
							<TouchableOpacity style={styles.touch}><Text style={{fontFamily: "russoone-regular"}}>Nazwa: {item.name} </Text></TouchableOpacity>
						</View>
					)}
					keyExtractor={({name}, index) => name}
				/>
          </View>
		  
		  <View style={styles.answers}> 
		  <View style={styles.row}>
              <Button color="#494949" title='Answer A' onPress={() => {this.operation({navigation},this.state.answer_1) }}/>
              <Button color="#494949" title='Answer B' onPress={() => {this.operation({navigation},this.state.answer_2) }}/>
            </View>
            <View style={styles.row}>
              <Button color="#494949" title='Answer C' onPress={() => {this.operation({navigation},this.state.answer_3) }}/>
              <Button color="#494949" disabled={this.state.answer_4 === undefined ? true : false} title='Answer D' onPress={() => {this.operation({navigation},this.state.answer_4) }}/>
            </View>
		  
          </View>
        </View>
      </View>
    );
  }
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
    marginStart: 20,
    marginEnd: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  question: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#434343',
    marginBottom: 20,
  },
  answers: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#434343',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});