import React from 'react';
import {
	AsyncStorage,
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity
	} from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleLineIconsIcon from 'react-native-vector-icons/SimpleLineIcons';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	async getLoggedInUser(){
		return await AsyncStorage.getItem('user').then(req => JSON.parse(req))
			.then((userObj) => {
				this.setState({loggedInUser: userObj});
				console.log(this.state.loggedInUser);
		});
	}

	async componentDidMount() {
		await this.getLoggedInUser();
	}

	async componentWillUnmount() {
		//console.log("in cWUnmount");
	}

	async componentDidUpdate() {
		//console.log("in cDUpdate");
	}

	onLogin = async () => {
		if (!this.state) {	
			return;
		} else {
			await this.doLogin(this.state.username, this.state.password);
		}
	}

	render () {
		const loginForm = (
			<View style={styles.loginInfo}>
				<View style={styles.username}>
					<View style={styles.unIconRow}>
						<FeatherIcon name="user" style={styles.unIcon} />
						<TextInput
							placeholderTextColor="#e6e6e6"
							editable={true}
							placeholder="Username"
							defaultValue=""
							autoCapitalize="none"
							onChangeText={(text) => this.setState({username:text})}
						/>
					</View>
					<View style={styles.unLine} />
				</View>

				<View style={styles.password}>
					<View style={styles.pwIconRow}>
						<SimpleLineIconsIcon name="lock" style={styles.pwIcon} />
						<TextInput
							placeholder="Password"
							defaultValue=""
							placeholderTextColor="#e6e6e6"
							editable={true}
							secureTextEntry={true}
							style={styles.pwInput}
							onChangeText={(text) => this.setState({password:text})}
						/>
					</View>
					<View style={styles.pwLine} />
				</View>

				<View style={styles.loginButton}>
					<TouchableOpacity
						onPress={this.onLogin}
						style={styles.loginContainer}>
						<Text style={styles.login2}>Login</Text>
					</TouchableOpacity>
				</View>
			
				<View style={styles.createAccount}>
					<Text style={styles.newText}>New? </Text>
					<TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
						<Text style={styles.createAccountHere}>Create account here!</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.createAccount} />
				<TouchableOpacity onPress={() => this.props.navigation.navigate('Application')}>
					<Text style={styles.continueAsGuest}>Continue as guest</Text>
				</TouchableOpacity>
			</View>
		);	

		const logoutButton = (
			<View style={styles.loginInfo}>
				<Text>{this.state.loggedInUser ? 'Logged in as' + this.state.loggedInUser.name : '' }</Text>
				
				<TouchableOpacity onPress={this.doLogout} style={styles.loginContainer}>
					<Text style={styles.login2}>Logout</Text>
				</TouchableOpacity>
			</View>
		);

		return (
			<View style={styles.container}>
				<Text style={styles.pryce}>PRYCE</Text>

				{ this.state.loggedInUser ? logoutButton : loginForm }

			</View>
		);
	}

	doLogout = async () => {
		return await AsyncStorage.removeItem('user').then(this.setState({loggedInUser: null}));
	}

	async doLogin(username, password) {
		//chb:debug
		console.log("in doLogin, username: " + username + ", password: " + password);
		fetch('https://pryce-cs467.appspot.com/login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"username": username,
				"password": password,
			}),
		})
		.then(async (res) => {if (!res.ok) {
				let json = await res.json();
				if (json) {
					alert(json.message);
					return;
				}
				throw new Error('Network response not ok.');
			}
			//return Promise wrapped js object 
			return res.json();
		})
		.then( async (responseJson) => {
			if (responseJson) {
				console.log("access_token from resp: " + responseJson.access_token)
				let userCredentials = {
					isLoggedIn: true,
					authToken: responseJson.access_token,
					id: null,
					name: username
				}
				await AsyncStorage.setItem('user', JSON.stringify(userCredentials));
				this.setState({loggedInUser: userCredentials});
				this.props.navigation.navigate('Application');
			}
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	pryce: {
		flex: 1,
		fontSize: 70,
		textAlign: 'center',
		paddingTop: 120,
	},
	loginInfo: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 2
	},
	username: {
		width: 220,
		height: 23,
	},
	unIcon: {
		fontSize: 20,
		opacity: 0.5,
		alignSelf: 'flex-end',
		marginBottom: 1,
	},
	unInput: {
		width: 193,
		height: 15,
		color: '#121212',
		textAlign: 'left',
		marginLeft: 6,
		marginTop: 6,
	},
	unIconRow: {
		height: 21,
		flexDirection: 'row',
		marginRight: 1,
	},
	unLine: {
		width: 218,
		height: 1,
		backgroundColor: '#060606',
		opacity: 0.25,
		marginTop: 1,
		marginLeft: 2,
	},
	password: {
		width: 220,
		height: 23,
		marginTop: 19,
	},
	pwIcon: {
		fontSize: 20,
		opacity: 0.5,
		alignSelf: 'flex-end',
		marginBottom: 1,
	},
	pwInput: {
		width: 193,
		height: 15,
		color: '#121212',
		textAlign: 'left',
		marginLeft: 6,
		marginTop: 6,
	},
	pwIconRow: {
		height: 21,
		flexDirection: 'row',
		marginRight: 1,
	},
	pwLine: {
		width: 218,
		height: 1,
		backgroundColor: '#060606',
		opacity: 0.25,
		marginTop: 1,
		marginLeft: 2,
	},
	loginButton: {
		width: 161,
		height: 32,
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	loginContainer: {
		width: 161,
		height: 32,
		borderRadius: 6,
		borderWidth: 1,
		borderStyle: 'solid',
	},
	login2: {
		color: '#121212',
		textAlign: 'center',
		paddingTop: 7,
	},
	createAccount: {
		width: 168,
		height: 16,
		flexDirection: 'row',
		flex: 1,
		alignSelf: 'center',
	},
	newText: {
		color: '#121212',
		fontSize: 14,
		marginTop: 2,
	},
	createAccountHere: {
		top: 2,
		left: 0,
		color: '#126ef7',
		fontSize: 14,
	},
	continueAsGuest: {
		width: 125,
		height: 18,
		color: '#126ef7',
		fontSize: 14,
		alignSelf: 'center',
		marginBottom: 57,
	},
});

export default Login;
