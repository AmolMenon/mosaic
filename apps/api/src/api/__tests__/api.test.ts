import request from "supertest";
import { app } from "../../main";

describe("API Layer", () => {
  it("should return 401 Unauthorized if no auth header is provided", async () => {
    const res = await request(app).get("/api/v1/projects");
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("UNAUTHORIZED");
    expect(res.body.request_id).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });

  it("should successfully list projects with pagination when authenticated", async () => {
    const res = await request(app)
      .get("/api/v1/projects?limit=10")
      .set("Authorization", "Bearer valid-token");
    
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.has_more).toBe(false);
  });

  it("should return a standardized error on validation failure", async () => {
    const res = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", "Bearer valid-token")
      .send({}); // Missing name

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_INPUT");
    expect(res.body.message).toBe("Project name is required.");
  });

  it("should include custom headers from middleware", async () => {
    const res = await request(app)
      .get("/api/v1/health/liveness");
      
    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBeDefined();
  });
});
