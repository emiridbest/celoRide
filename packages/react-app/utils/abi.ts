export const contractAddress = "0x58bc7932bC31c5D0E3390F13E31F5897528D0385";
export const abi = [{"type":"function","name":"acceptRide","inputs":[{"name":"_rider","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"availableDrivers","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"completeRide","inputs":[{"name":"_rider","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"drivers","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"driverAddress","type":"address","internalType":"address"},{"name":"name","type":"string","internalType":"string"},{"name":"lat","type":"uint256","internalType":"uint256"},{"name":"lng","type":"uint256","internalType":"uint256"},{"name":"isAvailable","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"getAvailableDrivers","inputs":[],"outputs":[{"name":"","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"registerDriver","inputs":[{"name":"_name","type":"string","internalType":"string"},{"name":"_lat","type":"uint256","internalType":"uint256"},{"name":"_lng","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"requestRide","inputs":[{"name":"_driver","type":"address","internalType":"address"},{"name":"_startLat","type":"uint256","internalType":"uint256"},{"name":"_startLng","type":"uint256","internalType":"uint256"},{"name":"_destLat","type":"uint256","internalType":"uint256"},{"name":"_destLng","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"rides","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"rider","type":"address","internalType":"address"},{"name":"driver","type":"address","internalType":"address"},{"name":"startLat","type":"uint256","internalType":"uint256"},{"name":"startLng","type":"uint256","internalType":"uint256"},{"name":"destLat","type":"uint256","internalType":"uint256"},{"name":"destLng","type":"uint256","internalType":"uint256"},{"name":"status","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"updateDriverLocation","inputs":[{"name":"_lat","type":"uint256","internalType":"uint256"},{"name":"_lng","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"DriverLocationUpdated","inputs":[{"name":"driver","type":"address","indexed":true,"internalType":"address"},{"name":"lat","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"lng","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"DriverRegistered","inputs":[{"name":"driver","type":"address","indexed":true,"internalType":"address"},{"name":"lat","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"lng","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"RideAccepted","inputs":[{"name":"driver","type":"address","indexed":true,"internalType":"address"},{"name":"rider","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RideCompleted","inputs":[{"name":"driver","type":"address","indexed":true,"internalType":"address"},{"name":"rider","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RideRequested","inputs":[{"name":"rider","type":"address","indexed":true,"internalType":"address"},{"name":"driver","type":"address","indexed":true,"internalType":"address"}],"anonymous":false}]