/* 
node-bomstrip-stream
https://github.com/tracker1/node-bomstrip-stream

The MIT License (MIT)

Copyright (c) 2014 Michael J. Ryan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE

*/

var util = require('util')
	,stream = require('stream')
	;

module.exports = BomStrippingStream;

util.inherits(BomStrippingStream, stream.Transform);

function BomStrippingStream(options) {
	if (!(this instanceof BomStrippingStream)) return new BomStrippingStream(options);

	stream.Transform.apply(this, arguments);

	var atStart = true;
	this._transform = function(chunk, encoding, done) {
		if (atStart) {
			atStart = false; //only runs this at the beginning
			if (chunk[0] == 0xEF && chunk[1] == 0xBB && chunk[2] == 0xBF) {
				chunk = chunk.slice(3);
			}
		}
		this.push(chunk);
		return done();
	};
}