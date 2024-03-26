const { Teach } = require("../models/Teach.modal");
const BasicServices = require("./basic.service");

class TeachService extends BasicServices {
  constructor() {
    super(Teach);
  }
}

module.exports.TeachService = new TeachService();
