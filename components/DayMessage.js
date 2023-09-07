import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const DayMessage = () => {
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const textWidth = 300;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(scrollAnim, {
                toValue: -textWidth,
                duration: 5000,
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
                <Text style={styles.text} numberOfLines={1}>Message du jour : Ecoutez Duvet de bôa</Text>
                <Text style={styles.text} numberOfLines={1}>Message du jour : Ecoutez Duvet de bôa</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    text: {
        width: 300,
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default DayMessage;
