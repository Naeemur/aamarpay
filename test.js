const PAY = require('./aamarpay');

// A string of good length. Should be stored securely.
const KEY = "OHZTDSRCU75APMKGYBHA0IL1GQDPXZHAGCAUAWOR9EXHVND9AAMEVEMAEZXIYLTR";

let ip = '20.20.20.20',
	domain = 'domain.com',
	storeId = 'storeid',
	signatureKey = 'abcdefgh',
	hashKey = KEY;

PAY.init({ ip, domain, storeId, signatureKey, hashKey });

let seed = 'ABCD' // can not be empty
let token = PAY.token(seed)
console.log('TOKEN: ', token);
console.log('VERIFY: ', PAY.verify(seed, token));

PAY.post({
	tran_id: '',
	success_url: '',
	fail_url: '',
	cancel_url: '',
	ipn_url: '',
	// opt_a: '',// optional
	// opt_b: '',// optional
	// opt_c: '',// optional
	// opt_d: '',// optional
	amount: '10',
	// payment_type: '',// optional
	currency: 'BDT',
	desc: '',
	cus_name: '',
	cus_email: '',
	cus_add1: '',
	// cus_add2: '',// optional
	cus_city: '',
	cus_state: '',
	cus_postcode: '',
	cus_country: '',
	cus_phone: '',
	// all ship_* are optional
	// ship_name: '',
	// ship_add1: '',
	// ship_add2: '',
	// ship_city: '',
	// ship_state: '',
	// ship_postcode: '',
	// ship_country: '',
})
	.then(({ statusCode, data, headers, track, url }) => {
		console.log('RES: ', data);
	})
	.catch(({ statusCode, data, headers }) => {
		console.log('ERR: ', statusCode, data, headers);
	});