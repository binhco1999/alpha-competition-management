export interface Competition {
    id: number;
    tokenName: string;
    condition: string;
    deadline: string;
    reward: number;
}

export interface AlphaSoon {
    id: number;
    tokenName: string;
    date?: string;
    date1?: string;
    date2?: string;
    type: string;
    reward: string;
    points?: string;
    point1?: string;
    point2?: string;
    tags?: number[];
}

export const competitionsData: Competition[] = [
    // { id: 20, tokenName: 'BGSC', condition: 'Top 12500', deadline: '15/07/2025 15:30:00', reward: 10900 },
    // { id: 22, tokenName: 'OIK', condition: 'Top 5000', deadline: '22/07/2025 20:00:00', reward: 1000 },
    // { id: 23, tokenName: 'M', condition: 'Top 14000', deadline: '24/07/2025 23:00:00', reward: 357 },
    // { id: 24, tokenName: 'IDOL', condition: 'Top 8000', deadline: '24/07/2025 23:00:00', reward: 4750 },
    // { id: 25, tokenName: 'AIN', condition: 'Top 9000', deadline: '24/07/2025 23:00:00', reward: 733 },
    // { id: 26, tokenName: 'CROSS', condition: 'Top 11000', deadline: '24/07/2025 23:00:00', reward: 909 },
    // { id: 27, tokenName: 'ECHO', condition: 'Top 5000', deadline: '24/07/2025 23:00:00', reward: 2000 },
    // { id: 28, tokenName: 'PEAQ', condition: 'Top 11000', deadline: '26/07/2025 14:00:00', reward: 955 },
    // { id: 29, tokenName: 'SPA', condition: 'Top 9000', deadline: '27/07/2025 21:00:00', reward: 4900 },
    // { id: 31, tokenName: 'SUNDOG', condition: 'Top 11300', deadline: '31/07/2025 23:00:00', reward: 1111 },
    // { id: 32, tokenName: 'NFT', condition: 'Top 11300', deadline: '31/07/2025 23:00:00', reward: 155474173 },
    // { id: 33, tokenName: 'PEPEONTRON', condition: 'Top 11300', deadline: '31/07/2025 23:00:00', reward: 990 },
    // { id: 34, tokenName: 'TRX', condition: 'Top 11300', deadline: '31/07/2025 23:00:00', reward: 230 },
    // { id: 30, tokenName: 'UPTOP', condition: 'Top 5580', deadline: '03/08/2025 14:00:00', reward: 1700 },
    { id: 35, tokenName: 'VRA', condition: 'Top 15000', deadline: '10/08/2025 15:00:00', reward: 64000 },
    { id: 36, tokenName: 'ASP', condition: 'Top 14000', deadline: '13/08/2025 23:00:00', reward: 428 },
    { id: 37, tokenName: 'ZRC', condition: 'Top 14000', deadline: '13/08/2025 23:00:00', reward: 1785 },
    { id: 38, tokenName: 'YALA', condition: 'Top 14000', deadline: '13/08/2025 23:00:00', reward: 357 },
    { id: 39, tokenName: 'TA', condition: 'Top 6000', deadline: '13/08/2025 23:00:00', reward: 1000 },
    { id: 40, tokenName: 'MIA', condition: 'Top 6700', deadline: '15/08/2025 14:00:00', reward: 740 },
];

export const alphaSoonData: AlphaSoon[] = [
    // { id: 1, tokenName: 'ERA', type: 'AIRDROP', date1: '17/07/2025 20:30:00', date2: '18/07/2025 14:30:00', reward: '150', point1: '224', point2: '140' },
    // { id: 3, tokenName: 'TAKER', type: 'AIRDROP2', date: '18/07/2025 17:00:00', reward: '1000', points: '165' },
    // { id: 4, tokenName: 'G', type: 'AIRDROP2', date: '18/07/2025 20:00:00', reward: '88000', points: '165' },
    // { id: 5, tokenName: 'ESPORTS', type: 'AIRDROP2', date: '19/07/2025 23:00:00', reward: '', points: '' },
    // { id: 6, tokenName: 'TA', type: 'AIRDROP2', date: '21/07/2025 14:00:00', reward: '', points: '' },
    // { id: 7, tokenName: 'ZKWASM', type: 'IDO', date: '22/07/2025 15:00:00', reward: '', points: '225' },
    // { id: 8, tokenName: 'ZALA', type: 'AIRDROP2', date: '22/07/2025 23:00:00', reward: '', points: '' },
    // { id: 9, tokenName: 'COA', type: 'AIRDROP2', date: '23/07/2025 23:00:00', reward: '', points: '' },
    // { id: 10, tokenName: 'ASP', type: 'AIRDROP2', date: '24/07/2025 23:00:00', reward: '', points: '' },
    // { id: 11, tokenName: 'LN', type: 'AIRDROP2', date: '25/07/2025 23:00:00', reward: '', points: '' },
    // { id: 12, tokenName: 'PHY', type: 'AIRDROP2', date: '26/07/2025 23:00:00', reward: '', points: '' },
    // { id: 12, tokenName: 'DELABS', type: 'IDO', date: '28/07/2025 15:00:00', reward: '', points: '' },
    // { id: 13, tokenName: 'TREE', type: 'AIRDROP', date1: '29/07/2025 19:00:00', date2: '30/07/2025 13:00:00', reward: '100', point1: '233', point2: '200', tags: [1, 2] },
    // { id: 132, tokenName: 'GAIA', type: 'AIRDROP', date1: '30/07/2025 15:00:00', date2: '31/07/2025 9:00:00', reward: '500', point1: '233', point2: '200' },
    // { id: 1323, tokenName: 'RHEA', type: 'AIRDROP2', date: '30/07/2025 20:30:00', reward: '1000', points: '200' },
    // { id: 14, tokenName: 'NAORIS', type: 'AIRDROP2', date: '31/07/2025 19:00:00', reward: '', points: '', tags: [1] },
    // { id: 142, tokenName: 'PLAY', type: 'AIRDROP2', date: '31/07/2025 15:00:00', reward: '', points: '', tags: [1] },
    // { id: 141, tokenName: 'AIO', type: 'AIRDROP2', date: '02/08/2025 23:00:00', reward: '', points: '' },
    // { id: 143, tokenName: 'MM', type: 'AIRDROP2', date: '03/08/2025 23:00:00', reward: '', points: '' },
    // { id: 141, tokenName: 'CYCLE', type: 'AIRDROP2', date: '04/08/2025 18:00:00', reward: '800', points: '200' },
    // { id: 143, tokenName: 'DARK', type: 'AIRDROP2', date: '04/08/2025 19:00:00', reward: '1000', points: '200' },
    // { id: 142, tokenName: 'TOWNS', type: 'AIRDROP', date1: '05/08/2025 19:30:00', date2: '06/08/2025 13:30:00', reward: '1359', point1: '230', point2: '200', tags: [1, 2] },
    // { id: 1422, tokenName: 'PROVE', type: 'AIRDROP2', date: '05/08/2025 23:00:00', reward: '', points: '', tags: [1, 2] },
    { id: 146, tokenName: 'FIR', type: 'AIRDROP2', date: '06/08/2025 18:00:00', reward: '1000', points: '200' },
    { id: 1462, tokenName: 'IN', type: 'AIRDROP2', date: '07/08/2025 16:00:00', reward: '', points: '', tags: [1] },
    { id: 124, tokenName: 'X', type: 'AIRDROP2', date: '07/08/2025 23:00:00', reward: '', points: '' },
    { id: 213, tokenName: 'K', type: 'AIRDROP2', date: '08/08/2025 23:00:00', reward: '', points: '' },
    { id: 20, tokenName: 'BTR', type: 'AIRDROP2', date: '', reward: '', points: '' },
]; 