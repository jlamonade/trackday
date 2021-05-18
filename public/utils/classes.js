class Choice {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.short = `${value} ${name}`;
  }
}

module.exports = { Choice };
