import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export default function AppContextProvider({ children }) {
	const { colorScheme, setColorScheme } = useColorScheme();
	const [theme, setTheme] = useState(colorScheme);
	const [language, setLanguage] = useState("");
	const [connected, setConnected] = useState(true);
	const [data, setData] = useState([]);
	const [authenticated, setAuthenticated] = useState(false);
	const [moments, setMoments] = useState(null);

	useEffect(() => {
		(async () => {
			// get theme from storage
			const savedTheme = await AsyncStorage.getItem("theme");

			// if it exists, set theme
			if (savedTheme !== null && savedTheme !== "system") {
				setTheme(savedTheme);
			} else {
				// otherwise, set theme to system
				setTheme("system");
			}

			const savedLanguage = await AsyncStorage.getItem("language");

			if (savedLanguage !== null) {
				setLanguage(savedLanguage);
			} else {
				setLanguage(language.getLocales()[0].languageCode || "en");
			}

			// get data from storage
			const networkInfo = await NetInfo.fetch();
			if (networkInfo.isConnected) {
				try {
					const response = await fetch(
						"https://stud.hosted.hr.nl/1036029/PRG7/hotspots.json"
					);
					const json = await response.json();
					await AsyncStorage.setItem("data", JSON.stringify(json.hotspots));
					setData(json.hotspots);
				} catch (e) {
					// attempt to get data from storage
					getDataFromStorage();
				}
			} else {
				setConnected(false);
				getDataFromStorage();
			}

			// get moments from storage
			const savedMoments = await AsyncStorage.getItem("moments");
			console.log(savedMoments);
			if (savedMoments !== null) {
				setMoments(JSON.parse(savedMoments));
			} else {
				setMoments([]);
			}
		})();

		const disconnect = NetInfo.addEventListener((state) => {
			setConnected(state.isConnected);
		});

		return disconnect;
	}, []);

	const getDataFromStorage = async () => {
		const savedData = await AsyncStorage.getItem("data");
		if (savedData !== null) {
			setData(JSON.parse(savedData));
		} else {
			Alert.alert(
				"No internet connection",
				"Please connect to the internet to use this app.",
				[{ text: "OK" }],
				{ cancelable: false }
			);
		}
	};

	useEffect(() => {
		console.log("setting theme to", theme);
		setColorScheme(theme);

		(async () => {
			try {
				if (theme == "system") {
					await AsyncStorage.removeItem("theme");
				} else {
					await AsyncStorage.setItem("theme", theme);
				}
			} catch (e) {
				console.log(e);
			}
		})();
	}, [theme]);

	useEffect(() => {
		if (!moments) return;

		(async () => {
			try {
				await AsyncStorage.setItem("moments", JSON.stringify(moments));
			} catch (e) {
				console.log(e);
			}
		})();
	}, [moments]);

	useEffect(() => {
		if (!language) return;
		(async () => {
			console.log("setting language to", language);
			try {
				await AsyncStorage.setItem("language", language);
			} catch (e) {
				console.log(e);
			}
		})();
	}, [language]);

	return (
		<AppContext.Provider
			value={{
				theme,
				setTheme,
				colorScheme,
				language,
				setLanguage,
				connected,
				data,
				authenticated,
				setAuthenticated,
				moments,
				setMoments,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
