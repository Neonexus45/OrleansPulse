import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Canvas from 'react-native-canvas';

const DayCanvas = ({ isToday }) => {

    const windowWidth = Dimensions.get('window').width / 8;
    const timeSlotHeight = Dimensions.get('window').height / 12;

    const handleCanvas = (canvas) => {
        if (canvas) {
            canvas.width = windowWidth;
            canvas.height = timeSlotHeight * 24;

            const context = canvas.getContext('2d');
            context.strokeStyle = 'gray';
            context.lineWidth = 0.25;

            [...Array(24).keys()].forEach((hour, index) => {
                let yPosition = index * timeSlotHeight;

                context.beginPath();
                context.moveTo(0, yPosition);
                context.lineTo(windowWidth, yPosition);
                context.stroke();

                if (isToday && hour === new Date().getHours()) {
                    context.fillStyle = '#E4E4E4';
                    context.fillRect(0, yPosition, windowWidth, timeSlotHeight);
                }
            });
        }
    };

    return <Canvas ref={handleCanvas} style={{ width: windowWidth, height: timeSlotHeight * 24 }} />;
};

export default DayCanvas;
