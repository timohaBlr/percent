import type {Board, Log} from "../feautures/shifts/types.ts";

const gostTable: Record<number, Record<number, number>> = {
    6: {
        14: 0.123,
        16: 0.155,
        18: 0.194,
        20: 0.230,
        22: 0.280,
        24: 0.330,
        26: 0.390,
        28: 0.450,
        30: 0.520,
        32: 0.590,
        34: 0.660,
        36: 0.740,
        38: 0.820,
        40: 0.900,
        42: 1.000,
        44: 1.090,
        46: 1.190,
        48: 1.300,
        50: 1.410,
        52: 1.530,
        54: 1.650,
        56: 1.780,
        58: 1.910,
        60: 2.050,
        62: 2.180,

    },
    4: {14:	0.073 ,
        16:	0.095 ,
        18:	0.120 ,
        20:	0.147 ,
        22:	0.178 ,
        24:	0.210 ,
        26:	0.250 ,
        28:	0.290 ,
        30:	0.330 ,
        32:	0.380 ,
        34:	0.430 ,
        36:	0.480 ,
        38:	0.530 ,
        40:	0.580 ,
        42:	0.640 ,
        44:	0.700 ,
        46:	0.770 ,
        48:	0.840 ,
        50:	0.910 ,
        52:	0.990 ,
        54:	1.070 ,
        56:	1.160 ,
        58:	1.250 ,
        60:	1.330 ,
        62:	1.430 ,
    },
    3: {14:	0.052 ,
        16:	0.069 ,
        18:	0.086 ,
        20:	0.107 ,
        22:	0.130 ,
        24:	0.157 ,
        26:	0.185 ,
        28:	0.220 ,
        30:	0.250 ,
        32:	0.280 ,
        34:	0.320 ,
        36:	0.360 ,
        38:	0.390 ,
        40:	0.430 ,
        42:	0.470 ,
        44:	0.520 ,
        46:	0.570 ,
        48:	0.620 ,
        50:	0.670 ,
        52:	0.730 ,
        54:	0.800 ,
        56:	0.860 ,
        58:	0.920 ,
        60:	0.990 ,
        62:	1.060 ,
    },
};

// [3, 4].forEach((len) => {
//     Object.entries(gostTable[6]).forEach(([d, v]) => {
//         gostTable[len][Number(d)] = (v * len) / 6;
//     });
// });


export const calcLogVolume = (log: Log) => {
    return gostTable[log.length][log.diameter] || 0;
};
const calcGostVolume = (log: Log) => {
    return gostTable[log.length][log.diameter] || 0;
};


/*export const calcLogVolume = (log: Log) => {
    const radius = log.diameter / 2000; // mm -> meters /2
    return Math.PI * radius * radius * log.length;
};*/

export const calcBoardVolume = (b: Board) => {
    return (b.thickness / 1000) * (b.width / 1000) * b.length * b.quantity;
};