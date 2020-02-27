import mojs from '@mojs/core';

const littleOptions = function(color) {
    if (color === undefined) {
        color = '#ccc';
    }
    return new mojs.Burst({
        left: 0,
        top: 0,
        radius: {15: 25},
        angle: 0,
        children: {
            shape: 'line',
            radius: 3,
            scale: 1,
            stroke: color,
            strokeDasharray: '100%',
            strokeDashoffset: {'-100%': '100%'},
            duration: 700,
            easing: 'quad.out',
        },
    });
};

const Animation = {
    littleOptions,
};

export default Animation;
