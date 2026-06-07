export type OddsResult = {
    total: number;
    runnerTotals: Record<string, number>;
    odds: Record<string, number>;
};