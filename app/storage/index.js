module.exports = new class Storage {
	constructor() {
		this.storage = {};
	}

	get(key) {
		return this.storage[key] || false;
	}

	set(key, value) {

		if (this.get(key) !== false) {
			throw new Error('Уже есть поле с ключом:', key);
		}

		this.storage[key] = value;
		return this.storage[key];
	}

	upd(key, value) {
		this.storage[key] = value;
		return this.storage[key];
	}
};