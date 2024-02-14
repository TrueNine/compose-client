export function debug(msg?: unknown, enable?: boolean) {
    const debugMode = enable === true;
    if (debugMode) {
        console.log("\n==============================================");
        console.log(msg);
        console.log("==============================================\n");
    }
}
