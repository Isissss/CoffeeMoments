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
	const [favorites, setFavorites] = useState(null);

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

			getData();

			// get moments from storage
			const savedMoments = await AsyncStorage.getItem("moments");
			if (savedMoments !== null) {
				setMoments(JSON.parse(savedMoments));
			} else {
				setMoments([]);
			}

			// get favorites from storage
			const savedFavorites = await AsyncStorage.getItem("favorites");
			if (savedFavorites !== null) {
				setFavorites(JSON.parse(savedFavorites));
			} else {
				setFavorites([]);
			}
		})();

		// const disconnect = NetInfo.addEventListener((state) => {
		// 	setConnected(state.isConnected);
		// });

		// return disconnect;
	}, []);

	const getData = async () => {
		// get data from storage
		const networkInfo = await NetInfo.fetch();
		if (networkInfo.isConnected) {
			try {
				const response = await fetch(
					"https://stud.hosted.hr.nl/1036029/PRG7/hotspots2.json"
				);
				const data = await response.json();
				setData(data.hotspots);
				await AsyncStorage.setItem("data", JSON.stringify(data.hotspots));
				setConnected(true);
			} catch (e) {
				// attempt to get data from storage
				getDataFromStorage();
				console.log(e);
			}
		} else {
			setConnected(false);
			getDataFromStorage();
		}
	};

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
		if (!favorites) return;

		(async () => {
			try {
				await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
			} catch (e) {
				console.log(e);
			}
		})();
	}, [favorites]);

	useEffect(() => {
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
				favorites,
				setFavorites,
				getData,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
