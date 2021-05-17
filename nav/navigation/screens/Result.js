import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ListView, AppRegistry, FlatList} from 'react-native';

type Props = {};
export default class Result extends Component<Props> {
	
	header = [
		{ id: 0, text: 'Nick' }, 
		{ id: 1, text: 'Score' },
		{ id: 2, text: 'Total' },
		{ id: 3, text: 'Type' },
		{ id: 4, text: 'Date' },
		{ id: 5, text: 'ID' }];

	state = {
		data: ''
	}
	
	componentDidMount = () => {
		fetch('http://tgryl.pl/quiz/results', {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			this.setState({
				data: responseJson
			})
		})
		.catch((error) => {
			console.error(error);
		});
	}

	render() {
		return(
			<View style={{flex: 1, paddingTop:20}}>
				<View style={styles.txt}>
					{this.header.map((item, index) => <Text style={styles.header} key={index}>{item.text}</Text>)}
				</View>
				<FlatList
					data={this.state.data}
					renderItem={({item}) => (
						<View style={styles.txt}>
							<View style={styles.txt2}><Text>{item.nick}</Text></View>
							<View style={styles.txt2}><Text>{item.score}</Text></View>
							<View style={styles.txt2}><Text>{item.total}</Text></View>
							<View style={styles.txt2}><Text>{item.type}</Text></View>
							<View style={styles.txt2}><Text>{item.createdOn}</Text></View>
							<View style={styles.txt2}><Text>{item.id}</Text></View>
						</View>
					)}
					keyExtractor={({id}, index) => id}
				/>
			</View>
		);
	}

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },

  txt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: 12,
  },
  txt2: {
    backgroundColor: 'lightgray',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.7,
    borderColor: 'black',
    height: 50,
  },
  header: {
    backgroundColor: 'gray',
    width: '20%',
	textAlign:'center',
    padding: 5
  },
  bold: {
    fontWeight: 'bold'
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
});
