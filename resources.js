/** Here we can define any JavaScript-based resources and extensions to tables

class MyCustomResource extends tables.TableName {
  // we can define our own custom POST handler
  post(content) {
    // do something with the incoming content;
    return super.post(content);
  }
  // or custom GET handler
  get() {
    // we can modify this resource before returning
    return super.get();
  }
}
 */
// we can also define a custom resource without a specific table
class Songs extends tables.Songs {
  static loadAsInstance = false;

  async get(target) {
    target.checkPermission = false;
    return super.get(target);
  }
}

class SimpleUser extends tables.SimpleUser {
  static loadAsInstance = false;
}

class SingingRecord extends tables.SingingRecord {
  static loadAsInstance = false;
}

module.exports = {
  Songs,
  SimpleUser,
  SingingRecord,
};
