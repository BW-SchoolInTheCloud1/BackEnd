const request = require("supertest");
const db = require("../database/dbConfig");
const server = require("../api/server");

describe("admin router /api/admin", () => {
  let id, idVol, token;
  beforeAll(async () => {
    // await db.seed.run();
    await db("users").truncate();
    await db("admin").truncate();
    await db("volunteer").truncate();
    let res = await request(server)
      .post("/api/auth/register")
      .send({
        email: "a@admin.com",
        password: "pass",
        firstName: "Tom",
        lastName: "Tommerson",
        role: "admin"
      });
    let resVol = await request(server)
      .post("/api/auth/register")
      .send({
        email: "b@volunteer.com",
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

  beforeEach(async () => {
    await db.seed.run();
  });

  it("GET RQ with token in header returns status 200", async () => {
    let res = await request(server)
      .get(`/api/admin/${id}/todos`)
      .set({ Authorization: token });
    expect(res.status).toBe(200);
  });

  it("GET RQ - No token returns status 400", async () => {
    let res = await request(server).get(`/api/admin/${id}/todos`);
    expect(res.status).toBe(400);
  });

  test("POST todo returns status 201", async () => {
    // await db.seed.run();
    let res = await request(server)
      .post(`/api/admin/${id}/todos`)
      .set({ Authorization: token })
      .send({
        title: "Pass all tests",
        description: "npm run test",
        volunteer_id: idVol
      });

    expect(res.status).toBe(201);
  });

  afterAll(async () => {
    await db.destroy();
  });
});
