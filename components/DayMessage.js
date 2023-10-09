import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';

const getDayMessage = async (url) => {
    const messagePromise = fetch(url)
        .then(response => response.text())
        .then(data => {
            let lines = [];
            let i = 0;
            data.split("\n").forEach((line) => {
                lines[i] = line;
                i += 1;
            }, this);
            return lines[1];
        })
        .catch(error => console.error('Error fetching file:', error));

    const message = await messagePromise.json();
    console.log(message);
    return message;
}
const DayMessage = () => {
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const textContent = getDayMessage("https://orleanspulse.s3.eu-west-3.amazonaws.com/messages.txt");
    const textWidth = textContent.length*8;
    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(scrollAnim, {
                toValue: -textWidth,
                duration: textWidth*10,
                useNativeDriver: true,
            }),
            {
                iterations: -1,
                resetBeforeIteration: true,
            }
        );
        loop.start();
        return () => loop.stop();
    }, [scrollAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ flexDirection: 'row', transform: [{ translateX: scrollAnim }] }}>
                <Text numberOfLines={1} style={[styles.text, { width: textWidth }]}>{textContent}</Text>
                <Text numberOfLines={1} style={[styles.text, { width: textWidth }]}>{textContent}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default DayMessage;
