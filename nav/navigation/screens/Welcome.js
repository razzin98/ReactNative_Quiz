import React, { Component, PropTypes } from "react";
import {
  Modal,
  View,
  Text,
  TouchableHighlight
} from "react-native";
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicator from '@react-native-async-storage/async-storage';
export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }
  componentDidMount() {
    AsyncStorage.getItem(this.props.pagekey, (err, result) => {
      if (err) {
      } else {
        if (result == null) {
          console.log("null value recieved", result);
          this.setModalVisible(true);
        } else {
          console.log("result", result);
        }
      }
    });
    AsyncStorage.setItem(this.props.pagekey, JSON.stringify({"value":"true"}), (err,result) => {
            console.log("error",err,"result",result);
            });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          style={styles.container}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
        >
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{this.props.title}</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description} allowFontScaling={true}>
                {this.props.description}
              </Text>
            </View>
            <View style={styles.exitContainer}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <View style={styles.exitButtonContainer}>
                  <Text style={styles.exitButtonText}>Exit</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	container:{
		backgroundColor:'gray',
		flex:1,
		marginTop:50,
		marginBottom:50,
		marginLeft:20,
		marginRight:20,
		borderRadius:20,
		borderWidth:3,
		borderColor:'black'
	},
	title:{
		color:'white',
        fontWeight:'bold',
		fontSize:20,
		textAlign:'center',
		margin:10,	
	},
	description:{
		color:'white',
        fontSize:15,
		marginRight:20,
		marginLeft:20
	},
	closeIcon:{
		alignSelf:'flex-end',
		flex:0.5,
		marginRight:10
	},
	titleContainer:{
		flex:1,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center'
	},
	descriptionContainer:{
		flex:6.5
	},
	exitContainer:{
		flex:2,
		justifyContent:'flex-start',
		alignItems:'center',
	},
	exitButtonContainer:{
		width:250,
		height:40,
		backgroundColor:'black',
		borderRadius:10,
		justifyContent:'center',
	},
	exitButtonText:{
		color:'white',
		fontSize:20,
		textAlign:'center'
	}
});