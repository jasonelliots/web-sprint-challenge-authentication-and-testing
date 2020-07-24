const db = require("../database/dbConfig");
const Users = require("../auth/auth-model");
const supertest = require("supertest");
const server = require("../api/server");

describe("register", function () {
  it("can create a new user", async () => {
    await db("users").truncate();
    await Users.add({ username: "firstuser", password: "firstpass" });

    const users = await db("users");

    expect(users).toHaveLength(1);
  });

  it("should respond with correct status code", async (done) => {
    const credentials = { username: "thirduser", password: "thirdpass" };
    return supertest(server)
      .post("/api/auth/register")
      .send(credentials)
      .then((res) => {
        expect(res.status).toEqual(201);
        done(); 
      });
  });
});

describe("login", function () {

    it("should respond with correct status code", async (done) => {
        const credentials = { username: "thirduser", password: "thirdpass" };
        return supertest(server)
          .post("/api/auth/login")
          .send(credentials)
          .then((res) => {
            expect(res.status).toEqual(200);
            done();
          });
      });

      it("should respond with 'welcome in!'", async (done) => {
        const credentials = { username: "thirduser", password: "thirdpass" };
        return supertest(server)
        .post("/api/auth/login")
        .send(credentials)
            .then(res => {
                expect(res.body.message).toBe("welcome in!");
                done(); 
            });
    });

})
