import React from "react";
import { Text, View } from "react-native";

function MomentCard({ moment }) {
	console.log(moment);
	return (
		<View className="w-20 h-20 mx-3 bg-red-300">
			<Text>{moment.rating}</Text>
		</View>
	);
}

export default MomentCard;
