import React, { useState, useEffect, useRef } from "react";
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	Platform,
	TouchableWithoutFeedback,
} from "react-native";
import PropTypes from "prop-types";

export const KeycodeInput = (props) => {
	const [inputValue, setInputValue] = useState(props.defaultValue);
	const localInputRef = useRef(null);

	const focusInput = () => {
		if (localInputRef.current) {
			localInputRef.current.focus();
		}
	};

	useEffect(() => {
		let focusTries = 0;
		let focusInterval = setInterval(() => {
			if (localInputRef.current) {
				localInputRef.current.focus();
				console.log("✅ .focus() ejecutado con éxito");
				clearInterval(focusInterval);
			} else {
				focusTries++;
				console.log(`⏳ Esperando ref... intento ${focusTries}`);
				if (focusTries > 10) {
					console.log(
						"❌ No se pudo enfocar el input después de 10 intentos"
					);
					clearInterval(focusInterval);
				}
			}
		}, 100);
		return () => clearInterval(focusInterval);
	}, []);

	const changeText = (value) => {
		console.log("⌨️ Texto ingresado:", value);

		if (props.uppercase) value = value.toUpperCase();
		if (props.alphaNumeric) value = value.replace(/[^a-z0-9]/gi, "");

		setInputValue(value);

		if (props.onChange) {
			console.log("📝 Llamando props.onChange");
			props.onChange(value);
		}

		if (value.length >= props.length && props.onComplete) {
			console.log("✅ Código completo → props.onComplete");
			props.onComplete(value);
		}
	};

	const renderBoxes = () => {
		const elements = [];
		const vals = (inputValue ?? "").split("");
		const lastIndex = vals.length - 1;
		for (let i = 0; i < props.length; i++) {
			const active = i === vals.length;
			const barStyles = [
				styles.bar,
				active
					? [styles.barActive, { backgroundColor: props.tintColor }]
					: [],
			];
			let char = "";
			if (i < vals.length) {
				char = i === lastIndex ? vals[i] : "•"; // Solo último dígito visible
			}
			elements.push(
				<View style={styles.box} key={i}>
					<Text style={[styles.text, { color: props.textColor }]}>
						{char}
					</Text>
					<View style={barStyles} />
				</View>
			);
		}
		return elements;
	};

	const keyboardType = props.numeric
		? "numeric"
		: Platform.OS === "ios"
		? "ascii-capable"
		: "default";

	return (
		<TouchableWithoutFeedback onPress={focusInput}>
			<View style={[styles.container, props.style]}>
				{renderBoxes()}
				<TextInput
					ref={(component) => {
						localInputRef.current = component;
						console.log(
							"🔧 TextInput ref inicializado:",
							!!component
						);
						if (props.inputRef) {
							props.inputRef(component);
						}
					}}
					style={[
						styles.input,
						{
							color: "transparent",
							width: 42 * props.length,
						},
					]}
					autoFocus={props.autoFocus}
					autoCorrect={false}
					autoCapitalize="characters"
					value={inputValue}
					blurOnSubmit={false}
					keyboardType={keyboardType}
					maxLength={props.length}
					disableFullscreenUI
					clearButtonMode="never"
					spellCheck={false}
					returnKeyType="go"
					underlineColorAndroid="transparent"
					onChangeText={changeText}
					caretHidden
					onFocus={() => console.log("🟢 onFocus ejecutado")}
					onBlur={() => console.log("🔴 onBlur ejecutado")}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
};

KeycodeInput.propTypes = {
	length: PropTypes.number,
	tintColor: PropTypes.string,
	textColor: PropTypes.string,
	onChange: PropTypes.func,
	onComplete: PropTypes.func,
	autoFocus: PropTypes.bool,
	uppercase: PropTypes.bool,
	alphaNumeric: PropTypes.bool,
	numeric: PropTypes.bool,
	value: PropTypes.string,
	style: PropTypes.any,
	inputRef: PropTypes.func,
};

KeycodeInput.defaultProps = {
	tintColor: "#007AFF",
	textColor: "#000",
	length: 4,
	autoFocus: true,
	numeric: false,
	alphaNumeric: true,
	uppercase: true,
	defaultValue: "",
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		position: "relative",
	},
	input: {
		height: 48,
		position: "absolute",
		opacity: 0.01,
		zIndex: 100,
		fontSize: 1,
		backgroundColor: "transparent",
	},
	box: {
		width: 32,
		marginHorizontal: 5,
	},
	bar: {
		backgroundColor: "#CED5DB",
		height: 1,
		width: 32,
	},
	barActive: {
		height: 2,
		marginTop: -0.5,
	},
	text: {
		fontSize: 24,
		fontWeight: "600",
		lineHeight: 36,
		height: 36,
		textAlign: "center",
		width: 32,
		marginBottom: 8,
	},
});
