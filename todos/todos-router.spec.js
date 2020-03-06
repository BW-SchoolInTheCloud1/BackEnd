const request = require("supertest");
const db = require("../database/dbConfig");
const server = require("../api/server");

describe("todos router /api/todos", () => {
  let id, idVol, token;
  beforeAll(async () => {
    // await db.seed.run();
    await db("users").truncate();
    await db("admin").truncate();
    await db("volunteer").truncate();
    let res = await request(server)
      .post("/api/auth/register")
      .send({
        email: "tom@tom.com",
        password: "pass",
        firstName: "Tom",
        lastName: "Tommerson",
        role: "admin"
      });
    // let resVol = await request(server)
    //   .post("/api/auth/register")
    //   .send({
    //     email: "vol@volunteer.com",
    //     password: "pass",
    //     firstName: "Tom",
    //     lastName: "Tommerson",
    //     role: "volunteer",
    //     availability: "Mondays",
    //     country: "usa"
    //   });

    token = res.body.token;
    // id = res.body.roleId.id;
    // idVol = resVol.body.roleId.id;
  });

  it("GET RQ with token in header returns status 200", async () => {
    let res = await request(server)
      .get(`/api/todos`)
      .set({ Authorization: token });
    expect(res.status).toBe(200);
  });

  it("GET RQ - No token returns status 400", async () => {
    let res = await request(server).get(`/api/todos`);
    expect(res.status).toBe(400);
  });

  test("GET by id /:id with token and valid todo id returns status 200", async () => {
    // await db.seed.run();
    let res = await request(server)
      .get(`/api/todos/1`)
      .set({ Authorization: token });

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await db.destroy();
  });
});
