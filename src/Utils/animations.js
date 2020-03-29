import mojs from '@mojs/core';
import Util from './index';

const pop = function(color) {
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
const animate = function(e, color, method) {
    const pos = Util.getObjOffset(e.currentTarget);
    const size = Util.getObjSize(e.currentTarget);
    method((color||undefined))
        .tune({x: pos.left + size.w / 2, y: pos.top + size.h / 2})
        .replay();
};


const Animation = {
    animate,
    pop,
};

export default Animation;
