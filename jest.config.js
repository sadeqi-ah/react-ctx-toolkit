module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    testEnvironment: "jsdom",
}
