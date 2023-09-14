export const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const SERVER_URL_X = process.env.REACT_APP_SERVER_URL_X;

export const PrimaryGrey = "#828488";

export const ChainsConfig = {
	FVM_CALIBERATION: {
		chainId: 314159,
		chainName: "Filecoin - Caliberation testnet",
		nativeCurrency: { name: "Filecoin", symbol: "tFIL", decimals: 18 },
		rpcUrls: ["https://filecoin-calibration.chainstacklabs.com/rpc/v1"],
		blockExplorerUrls: ["https://calibration.filscan.io/"],
		contract_address: "0xC8f52445fbe5c341dc36E66153Ff1Ec528e6A7D4",
	},
	FVM_MAINNET: {
		chainId: 314,
		chainName: "Filecoin Mainnet",
		nativeCurrency: { name: "Filecoin", symbol: "FIL", decimals: 18 },
		rpcUrls: ["https://api.node.glif.io"],
		blockExplorerUrls: ["https://fvm.starboard.ventures/explorer/"],
		contract_address: "0x148F40E2462754CA7189c2eF33cFeD2916Ca1BC3",
	},
	POLYGON_TESTNET: {
		chainId: 80001,
		rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
		chainName: "Polygon Testnet",
		nativeCurrency: {
			name: "tMATIC",
			symbol: "tMATIC",
			decimals: 18,
		},
		blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
	},
};

export const CHAIN = ChainsConfig[process.env.REACT_APP_CHAIN];
