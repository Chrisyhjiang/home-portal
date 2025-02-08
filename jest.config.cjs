module.exports = {
  rootDir: ".",
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "@/(.*)": "<rootDir>/src/$1",
    "@hooks/(.*)": "<rootDir>/src/hooks/$1",
    "@features/(.*)": "<rootDir>/src/features/$1",
    "@shared/(.*)": "<rootDir>/src/shared/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "jsdom",
  resolver: "jest-ts-webcompat-resolver",
};
