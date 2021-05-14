import React, {Component} from 'react';
import NetInfo from "@react-native-community/netinfo";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity, FlatList, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicator from '@react-native-async-storage/async-storage';

import QuizStorage from '../QuizStorage'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: "baza.db", createFromLocation : 1 });

let exam_id;
type Props = {};
export default class Main extends Component<Props> {
	constructor(props) {
		QuizStorage.setQuestion_id(0);
		QuizStorage.setScore(0);
		super(props);
		
		var id_Quiz_numerator = 1;
        var id_Question_numerator = 1;
		
		this.state = {
			data: '',
			dataSource:[],
			daten:'',
		};
		
		db.transaction(tx => {
			tx.executeSql('SELECT * FROM Tests', [], (tx, results) => {
				var temp = [];
				for (let i = 0; i < results.rows.length; ++i) {
					temp.push(results.rows.item(i));
				}
				this.setState({
					dataSource: temp,
				});
			});
		});

	}
	
	saveTest = (testId, name, description, level,tag, numberOfTasks) => {
    const query = `INSERT INTO Tests (test_id, name, description, level,tag, numberOfTask) VALUES ("${testId}", "${name}", "${description}", "${level}", "${tag}", ${numberOfTasks})`
    return db.executeSql(query, [],
      (trans, results) => {
        //  console.log("Saved");
      },
      (error) => {
        console.log(error.message);
      });
	  
	}
	  
	saveQuest = (testId,id,name,quiz_id) => {
    const query = `INSERT INTO Questions (test_id, id, name, quiz_id) VALUES ("${testId}", ${id}, "${name}", ${quiz_id})`
    return db.executeSql(query, [],
      (trans, results) => {
        //  console.log("Saved");
      },
      (error) => {
        console.log(error.message);
      });

	}
	
	saveAns = (testId,id,name,question_id,is_true) => {
    const query = `INSERT INTO Answers (test_id, id, name, question_id, is_true) VALUES ("${testId}", ${id}, "${name}", ${question_id}, "${is_true}")`
    return db.executeSql(query, [],
      (trans, results) => {
        //  console.log("Saved");
      },
      (error) => {
        console.log(error.message);
      });
	}
  componentDidMount = () => {
	  NetInfo.fetch().then(state => {
		console.log("Connection type", state.type);
		console.log("Is connected?", state.isConnected);
		
		if(state.isConnected){
			var today = new Date(),
			tday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			console.log("zawartosc tday "+tday);
			
			db.transaction(tx => {
					tx.executeSql('SELECT * FROM Updates', [], (tx, results) => {
						var temp = [];
						for (let i = 0; i < results.rows.length; ++i) {
							temp.push(results.rows.item(i).last_updated);
						}
						this.setState({
							daten: temp[0],
						});
						console.log("%##%#%#%#%#% "+this.state.daten);
						console.log("zawartość date: "+temp[0]);
						if(this.state.daten===tday){
							console.log("DZIŚ JUŻ BYŁ UPDATE")
							
						}
						else{
							fetch('http://tgryl.pl/quiz/tests', {
								method: 'GET'
							})
							.then((response) => response.json())
							.then((responseJson) => {
								console.log(responseJson);
								this.getTest(responseJson)
								this.setState({
									data: responseJson
								})
							})
							.catch((error) => {
								console.error(error);
							});
							
							db.executeSql(`INSERT INTO Updates (last_updated) VALUES ("${tday}")`, [],
							(trans, results) => {
								  console.log("Date: "+tday);
							},
							(error) => {
								console.log(error.message);
							});
							Alert.alert(
								'1 aktualizacja dnia.'
							)
						}
					});
			});

		}
		else{
			Alert.alert(
				'No Internet access...'
			)
			db.executeSql(`SELECT * FROM Tests`, [],
			(trans, results) => {
				for (let i = 0; i < results.rows.length; ++i) {
					temp.push(results.rows.item(i));
				}
				this.setState({
					dataSource: temp,
				});
				console.log("666666666666666666666666666666");
			},
			(error) => {
				console.log("+++++++++++++++++++++++++++++++++++++++++++"+error.message);
			});
		}
		});
	}
  
	componentDidUpdate = () =>{
		this.shuffleDeck(this.state.dataSource);
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
	

	ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
    db.transaction((trans) => {
      trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
      },
        (error) => {
          reject(error);
        });
    });
  });

	getTest(items) {

      db.transaction(function(tx) {
       tx.executeSql('CREATE TABLE IF NOT EXISTS Updates (last_updated TEXT PRIMARY KEY)');
	   
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
         const name = responseJson2.name;
		 const count = parseInt(responseJson2.tasks.length);
 
                   this.saveTest(responseJson2.id,responseJson2.name,responseJson2.description,responseJson2.level,responseJson2.tags[0],responseJson2.numberOfTask);
                   for (let h = 0; h < responseJson2.tasks.length; ++h) {
					   
                     const question = responseJson2.tasks[h].question;
					 this.saveQuest(responseJson2.id,id_Question_numerator,question,id_Quiz_numerator);
					 
                     for (let k = 0; k < responseJson2.tasks[h].answers.length; ++k){
                       const answer = responseJson2.tasks[h].answers[k].content;
                       const correct = responseJson2.tasks[h].answers[k].isCorrect;
					   this.saveAns(responseJson2.id,k,answer,id_Question_numerator,correct);
                     }
                     id_Question_numerator++;
                   }
                  id_Quiz_numerator++;

       })
	   .catch((error) => {
			console.error("error in mapping response "+error);
		});
     })

	 db.executeSql(`SELECT * FROM Tests`, [],
			(trans, results) => {
				for (let i = 0; i < results.rows.length; ++i) {
					temp.push(results.rows.item(i));
				}
				this.setState({
					dataSource: temp,
				});
			},
			(error) => {
				console.log("error in selects "+error.message);
			});
	 
   }
   
	setTest(item,id,numberOfTasks,tags){
     const name = item;
     QuizStorage.setQuiz_name(name);
     db.transaction(function(tx) {
       tx.executeSql(`SELECT * FROM Tests WHERE name=?`, [name], (tx, results) => {
         QuizStorage.setQuiz_id(results.rows.item(0).id);
		 
         tx.executeSql(`SELECT COUNT(name) AS id FROM Questions WHERE quiz_id=?`, [results.rows.item(0).id], (tx, results2) => {
           QuizStorage.setTasks(results2.rows.item(0).id);
         },
			(error) => {
				console.log(error.message);
			});
       },
			(error) => {
				console.log(error.message);
			});
    });
	this.props.navigation.navigate("Exam",{name:name,exam: id,size:numberOfTasks,tag:tags});
	console.log(QuizStorage.getQuiz_id());
   }
	
	operation(exam_id) {
		console.log("Zapisuję id testu: "+ exam_id)
		this.props.navigation.navigate("Exam",{exam:exam_id,});
	}

	render() {
	  const { navigation } = this.props;
		return (
		  <View style={styles.container}>
			<View style={styles.container2}>
			
			
			<FlatList
				data={this.state.dataSource}
				renderItem={({item}) => (
					<View>
						<TouchableOpacity onPress={() => {this.setTest(item.name,item.test_id,item.numberOfTask,item.tag)}} style={styles.touch}><Text style={{fontFamily: "russoone-regular"}}>Nazwa: {item.name} {"\nOpis: "} {item.description} {"\nTagi: "} {item.tag} {"\nPoziom: "} {item.level} {"\nIlość pytań: "} {item.numberOfTask}</Text></TouchableOpacity>
					</View>
				)}
				keyExtractor={({name}, index) => name}
			/>

			</View>
			<View style={styles.footer}>
			  <Text style={styles.footerTXT}>Check your result !</Text>
			  <Button color="darkgray" title='Results' onPress={() => navigation.navigate("Result")}/>
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
    flex: 4,
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
  touch: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#434343',
    marginBottom: 20,
	padding:10,
  },
  btn: {
    flex: 1,
    marginBottom: 20,
  },
  footerTXT: {
    marginBottom: 10,
	fontFamily: "righteous-regular"
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#434343',
    alignItems: 'center',
  }
});
