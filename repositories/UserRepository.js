const User = require('../models/user');
const Educator = require('../models/educator');

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email: email });
  }

  async createUser(data) {
    const user = new User(data);
    return await user.save();
  }

  async createEducator(data) {
    const educator = new Educator();
    return await educator.save();
  }

  async updateUser(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = UserRepository;
