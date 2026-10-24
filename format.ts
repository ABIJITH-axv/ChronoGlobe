export const fmtYear = (y: number) => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : `${y}`);
