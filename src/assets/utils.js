let web3 = require("web3");

let utils = {
  fromWei(_value) {
    try {
      if (!_value) return 0;
      if (typeof _value == "number") {
        _value = web3.utils.toBN(_value);
      }
      return utils.fixed(web3.utils.fromWei(_value));
    } catch (error) {
      console.log("fromWei function error : ");
      console.log(_value, " : ", error);
    }
  },
  fixed(_value = 0, fractionDigits = 3) {
    _value = Number(_value);
    return Number(_value.toFixed(fractionDigits));
  },
  toWei(_value) {
    try {
      if (!_value) return 0;
      _value = _value + "";

      return web3.utils.toWei(_value);
    } catch (error) {
      console.log("toWei function error : ");
      console.log(_value, " : ", error);
    }
  },
};
module.exports = utils;
