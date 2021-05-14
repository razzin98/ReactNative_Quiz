// ./App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import FtreScreen from './screens/Welcome';
import {View} from 'react-native';
const App = () => {

	
  return (

	<NavigationContainer>
		<FtreScreen pagekey={"uniquekey"} title={"Welcome"} description={"in our Quiz App!"}/>
		<DrawerNavigator/>
	</NavigationContainer>
        
		

  );
};
export default App;