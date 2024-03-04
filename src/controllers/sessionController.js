class sessionController {
  async autenticateUser(user) {
    try {
      if (user) {
        return {
          code: 200,
          message: "Authorized",
        };
      }
    } catch (error) {}
  }
}

module.exports = sessionController;
