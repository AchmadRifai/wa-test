export const sleep = (delay: number) => new Promise((resolve, _) => {
    setTimeout(resolve, delay);
});
