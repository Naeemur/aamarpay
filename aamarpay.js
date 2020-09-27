const { Curl } = require('node-libcurl');
const QSTR = require('querystring');

const SHA = require('./sha-one')

const CONF = {
	IP: '',
	DOM: '',
	STO: '',
	SIG: '',
	KEY: '',
	SPL: [],
};

// let ENC = (obj) => Object.keys(obj).map(k => encodeURIComponent(k)+'='+encodeURIComponent(obj[k])).join('&')
const ENC = (obj) => QSTR.stringify(obj)

const CURL = (data, cb=x=>x, errCB=x=>x) => {
	const curl = new Curl();
	let $fields = PAY._opts(data),
		$fields_string = ENC($fields),
		$count_fields = Object.keys($fields).length,
		$domain = CONF.DOM,
		$url = `https://secure.aamarpay.com/request.php`,
		$ip = CONF.IP;
	// console.info($fields);
	// console.info('---');
	// curl.setOpt('FOLLOWLOCATION', true);
	curl.setOpt('HTTPHEADER', [`REMOTE_ADDR: ${$ip}`, `HTTP_X_FORWARDED_FOR: ${$ip}`]);
	curl.setOpt('SSL_VERIFYHOST', false);
	curl.setOpt('URL', $url);
	curl.setOpt('REFERER', $domain);
	curl.setOpt('INTERFACE', $ip);
	curl.setOpt('POST', $count_fields);
	curl.setOpt('POSTFIELDS', $fields_string);
	// curl.setOpt('RETURNTRANSFER', true);
	curl.on('end', function (statusCode, data, headers) {
		// console.info(statusCode)
		// console.info(data.length);
		// console.info(this.getInfo('TOTAL_TIME'));
		this.close();
		let track = PAY.track(data), url = PAY.url(track)
		cb({ statusCode, data, headers, track, url });
	});
	curl.on('error', function (statusCode, data, headers) {
		curl.close.bind(curl)(statusCode, data, headers);
		errCB({ statusCode, data, headers });
	});
	curl.perform();
}

const PAY = {
	init({ip, domain, storeId, signatureKey, hashKey}) {
		CONF.IP = ip
		CONF.DOM = domain
		CONF.STO = storeId
		CONF.SIG = signatureKey
		CONF.KEY = hashKey
		CONF.SPL = hashKey.split('')
	},
	_opts: (opt) => {
		let def = {
			store_id: CONF.STO,
			tran_id: '',
			success_url: '',
			fail_url: '',
			cancel_url: '',
			ipn_url: '',
			// opt_a: '',// optional
			// opt_b: '',// optional
			// opt_c: '',// optional
			// opt_d: '',// optional
			amount: '',
			// payment_type: '',// optional
			currency: 'BDT',
			signature_key: CONF.SIG,
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
		}
		Object.keys(opt).forEach(k => { def[k] = opt[k] })
		return def
	},
	post(data={}) {
		return new Promise((cb, errCB) => {
			CURL(PAY._opts(data), cb, errCB)
		})
	},
	token(seed='0') {
		if((seed+'').length < 1) return false
		let a = (seed+'').repeat(Math.ceil(CONF.SPL.length/seed.length)).substr(0,CONF.SPL.length).split('')
		let b = Array.from(CONF.SPL)
		let c = []
		for(let i=0; i<b.length; i++) c.push(b[i], a[i])
		return SHA(c.join(''))
	},
	verify(seed,token) {
		let t = this.token(seed)
		return (t && t === token)
	},
	track(l) {
		return l.replace(`"\\/paynow.php?track=`,``).replace(`"`,``)
	},
	url(t) {
		return `https://secure.aamarpay.com/paynow.php?track=${t}`
	},
}

module.exports = PAY