export function generateOpenApiSpec() {
  return {
    openapi: "3.0.0",
    info: {
      title: "Mosaic API",
      version: "1.0.0",
      description: "Mosaic OS Public API Layer"
    },
    paths: {
      "/api/v1/projects": {
        get: {
          summary: "List Projects",
          parameters: [
            { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
            { name: "cursor", in: "query", schema: { type: "string" } }
          ],
          responses: {
            "200": { description: "Success" }
          }
        },
        post: {
          summary: "Create Project",
          requestBody: {
            content: {
              "application/json": {
                schema: { type: "object", properties: { name: { type: "string" } } }
              }
            }
          },
          responses: {
            "201": { description: "Created" }
          }
        }
      },
      "/api/v1/executions": {
        post: {
          summary: "Create Execution"
        }
      }
    }
  };
}
