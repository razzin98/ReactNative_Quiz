// ./navigation/DrawerNavigator.js
import React, {Component} from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MainStackNavigator } from "./StackNavigator";
import { ResultStackNavigator } from "./StackNavigator";
import { ExamStackNavigator } from "./StackNavigator";
import { ExamResultsStackNavigator } from "./StackNavigator";
import { CommonActions } from '@react-navigation/native';

import { Platform, StyleSheet, Text, View, Button, Image, SaveAreaView, Alert } from 'react-native';


import { DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';

import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: "baza.db", createFromLocation : 1 });

const Drawer = createDrawerNavigator();
const TEST_NUM=3;
async function get_out(props){
 	  
		db.transaction(tx => {
			tx.executeSql('SELECT * FROM Tests order by random() limit 1', [], (tx, results) => {
				var randItem= results.rows.item(0)
				var randExam = { name: randItem.name, exam: randItem.test_id, size: randItem.numberOfTask, tag: randItem.tag};
				console.log(randExam);
				props.navigation.navigate("Exam",{name: randItem.name, exam: randItem.test_id, size: randItem.numberOfTask, tag: randItem.tag});
			});
		});

	}
	
	
	const saveTest = (testId, name, description, level,tag, numberOfTasks) => {
    const query = `INSERT INTO Tests (test_id, name, description, level,tag, numberOfTask) VALUES ("${testId}", "${name}", "${description}", "${level}", "${tag}", ${numberOfTasks})`
    return db.executeSql(query, [],
      (trans, results) => {
      },
      (error) => {
        console.log(error.message);
      });
	  
	}
	  
	const saveQuest = (testId,id,name,quiz_id) => {
    const query = `INSERT INTO Questions (test_id, id, name, quiz_id) VALUES ("${testId}", ${id}, "${name}", ${quiz_id})`
    return db.executeSql(query, [],
      (trans, results) => {
      },
      (error) => {
        console.log(error.message);
      });

	}
	
	const saveAns = (testId,id,name,question_id,is_true) => {
    const query = `INSERT INTO Answers (test_id, id, name, question_id, is_true) VALUES ("${testId}", ${id}, "${name}", ${question_id}, "${is_true}")`
    return db.executeSql(query, [],
      (trans, results) => {
      },
      (error) => {
        console.log(error.message);
      });
	}
	
	
	function getTest(items) {

      db.transaction(function(tx) {
       tx.executeSql('DROP TABLE IF EXISTS Questions;');
       tx.executeSql('CREATE TABLE IF NOT EXISTS Questions (test_id TEXT,id INTEGER, name TEXT, quiz_id INTEGER)');
       
	   tx.executeSql('DROP TABLE IF EXISTS Answers;');
       tx.executeSql('CREATE TABLE IF NOT EXISTS Answers (test_id TEXT,id INTEGER, name TEXT, question_id INTEGER, is_true TEXT)');
	   
	   tx.executeSql('DROP TABLE IF EXISTS Tests;');
       tx.executeSql('CREATE TABLE IF NOT EXISTS Tests (test_id TEXT PRIMARY KEY, name TEXT, description TEXT, level TEXT,tag TEXT, numberOfTask INTEGER)');
		
	 });
      const ids = items.map(item => `http://tgryl.pl/quiz/test/${item.id}`);
      ids.forEach(item => {
        id_Quiz_numerator = 1;
        id_Question_numerator = 1;
        return fetch(item,{
			method: 'GET'
		})
       .then((response2) => response2.json())
       .then((responseJson2) => {
                   saveTest(responseJson2.id,responseJson2.name,responseJson2.description,responseJson2.level,responseJson2.tags[0],responseJson2.tasks.length);
                   for (let h = 0; h < responseJson2.tasks.length; ++h) {
					   
                     const question = responseJson2.tasks[h].question;
					 saveQuest(responseJson2.id,id_Question_numerator,question,id_Quiz_numerator);
					 
                     for (let k = 0; k < responseJson2.tasks[h].answers.length; ++k){
                       const answer = responseJson2.tasks[h].answers[k].content;
                       const correct = responseJson2.tasks[h].answers[k].isCorrect;
					   saveAns(responseJson2.id,k,answer,id_Question_numerator,correct);
                     }
                     id_Question_numerator++;
                   }
                  id_Quiz_numerator++;

       })
	   .catch((error) => {
			console.error("tutaj "+error);
		});
     })
	 
   }
	
	function update_db(props){
	
		fetch('http://tgryl.pl/quiz/tests', {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			getTest(responseJson)

		})
		.catch((error) => {
			console.error(error);
		});
		console.log("Database has been updated!");
		props.navigation.navigate("Main");
		Alert.alert(
				'Baza została zaktualizowana.'
			)
	}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
		<Text style={{backgroundColor:'skyblue', textAlign:'center', padding:10, color:'white', fontSize:20}}>Quiz App</Text>
		<View style ={{height:150, backgroundColor:'lightblue', alignItems:'center', justifyContent:'center'}}>
			<Image source={require('./icon.png')} style={{height:100, width:100, borderRadius: 60}}/>
		</View>
      <DrawerItemList {...props} />
	  <DrawerItem label="Random exam" onPress={() => get_out(props) } />
	  <DrawerItem label="Aktualizuj bazę" onPress={() => update_db(props) } />
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
	
  return (
	<Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Main" component={MainStackNavigator} />
      <Drawer.Screen name="Result" component={ResultStackNavigator} />
    </Drawer.Navigator>
  );

};

export default DrawerNavigator;