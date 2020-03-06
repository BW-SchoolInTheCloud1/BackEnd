const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

describe("auth-router POST RQ /register", () => {
  beforeEach(() => {
    db("users").truncate();
    db("admin").truncate();
    db("volunteer").truncate();
  });

  test("/register returns status 201 with proper credentials", async () => {
    await db.seed.run();
    const res = await request(server)
      .post("/api/auth/register")
      .send({
        email: "tom@tom.com",
        password: "pass",
        firstName: "Tom",
        lastName: "Tommerson",
        role: "admin"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.type).toBe("application/json");
  });

  test("/register returns status 400 without proper credentials in request body", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ wrongInfo: "opps!" });

    expect(res.status).toBe(400);
  });
});

describe("auth-router POST RQ /login", () => {
  beforeEach(() => {
    db("users").truncate();
  });

  test("login user returns status 200", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ email: "tom@tom.com", password: "pass" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.type).toBe("application/json");
  });

  test("/login returns a token", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ email: "tom@tom.com", password: "pass" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("invalid credentials returns status 401", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ email: "wrong@wrong.com", password: "wrong" });
    expect(res.status).toBe(401);
  });
});
