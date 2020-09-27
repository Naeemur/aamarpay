# Node AamarPay

Node JS and Express JS module for using AamarPay payment gateway in Bangladesh.

## Features
- Easy setup and easy to use API
- Uses promises, so supports `async` `await` syntax
- Token generation and verification methods included

## Installation

```
npm install aamarpay
```

## Usage

```js
const PAY = require('aamarpay');

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
```

## API

```ts
init({ip, domain, storeId, signatureKey, hashKey})
```
It sets up the module for use, takes an object with 5 keys -

- `ip` the registered IP address for AamarPay
- `domain` the registered domain name for AamarPay
- `storeId` the store ID provided by AamarPay upon sign up
- `signatureKey` the signature key provided by AamarPay upon sign up
- `hashKey` a randomized string to generate and verify tokens. It should be of good length. It also should be stored securely.

```ts
post(data):Promise
```
It is a method that makes the payment processing request with `data` using curl and returns a promise. See example above and AamarPay documentation.

The promise resolves with an object with following properties -

- `statusCode` response status code
- `data` raw data returned from AamarPay
- `headers` response headers
- `track` tracking id of the requested invoice
- `url` payment url

The promise rejects with an object with following properties -

- `statusCode` response status code
- `data` raw data returned from AamarPay
- `headers` response headers
```ts
token(seed):String
```
It creates a hashed token that can be verified later. `seed` must be unique like a payment ID or order ID. this uses `hashKey` to generate token.

```ts
verify(seed,token):Boolean
```
It verifies a `token` for provided `seed` using `hashKey`.

## License
The MIT License (MIT)

Copyright (c) 2020 Md. Naeemur Rahman (https://naeemur.github.io)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.