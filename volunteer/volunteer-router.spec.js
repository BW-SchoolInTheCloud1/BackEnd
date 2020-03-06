const request = require("supertest");
const db = require("../database/dbConfig");
const server = require("../api/server");

describe("volunteer router /api/volunteer", () => {
  let id, idVol, token;
  beforeAll(async () => {
    // await db.seed.run();
    await db("users").truncate();
    await db("admin").truncate();
    await db("volunteer").truncate();
    let res = await request(server)
      .post("/api/auth/register")
      .send({
        email: "c@c.com",
        password: "pass",
        firstName: "Tom",
        lastName: "Tommerson",
        role: "admin"
      });
    let resVol = await request(server)
      .post("/api/auth/register")
      .send({
        email: "e@e.com",
        password: "pass",
        firstName: "Tom",
        lastName: "Tommerson",
        role: "volunteer",
        availability: "Mondays",
        country: "usa"
      });

    token = res.body.token;
    id = res.body.roleId.id;
    idVol = resVol.body.roleId.id;
  });

  it("GET RQ with token in header returns status 200", async () => {
    let res = await request(server)
      .get(`/api/volunteer`)
      .set({ Authorization: token });
    expect(res.status).toBe(200);
  });

  it("GET RQ - No token returns status 400", async () => {
    let res = await request(server).get(`/api/volunteer`);
    expect(res.status).toBe(400);
  });

  test("GET by id /:id with token and valid volunteer id returns status 200", async () => {
    // await db.seed.run();
    let res = await request(server)
      .get(`/api/volunteer/${idVol}`)
      .set({ Authorization: token });

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    await db.destroy();
  });
});
