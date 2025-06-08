export const isBeforeTwoPM = (): boolean => {
    const now = new Date();
    const hour = now.getHours();
    return hour < 20;
};