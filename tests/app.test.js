const request = require("supertest");
const app = require("../app");

const route = "/logout";

describe("[CONNECTION] checks", () => {
  test("Basic function test", () => {
    return request(app)
      .get(route)
      .expect(200);
  });
});
