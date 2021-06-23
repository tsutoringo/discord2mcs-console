const proc = require('child_process');
const { EventEmitter } = require('events');

class StackableLog extends EventEmitter {
	constructor (command, option) {
		super();
		this.process = proc.spawn(...command);
		this.option = Object.assign({
			cooltime: 1000,
			length: 2000
		}, option);
		
		this.stacks = [];

		this.process.stdout.on('data', log => {
			this.stacks.push(...(`${log}`.split(/[\n\r]+/).filter(l=>l!='')));
		});

		this.process.stderr.on('data', log => {
			this.stacks.push(...(`${log}`.split(/[\n\r]+/).filter(l=>l!='')));
		});

		setInterval(() => this._timer(), this.option.length);
	}

	_timer () {
		const sends = [];
		for (const i in this.stacks) {
			const stack = this.stacks[i];
			if ((sends.join('\n').length + stack.length) <= this.option.length) {
				sends.push(stack);
				if (this.stacks.length === Number(i)+1) {
					this.stacks.splice(0, i+1);
				}
			} else {
				this.stacks.splice(0, i);
				break;
			}
		}

		if (sends.length === 0) return;

		this.emit('log', sends);
	}
}

module.exports = StackableLog;
