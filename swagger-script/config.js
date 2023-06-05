const config = {
  targets: [
    {
      watchPath: "/src/service1",
      srcOpenApiPath: "/src/service1/openapi.yml",
      distOpenApiPath: "/dist/service1/openapi.yml",
      distTsSchemaPath: "/dist/service1/schema.d.ts",
    },
    {
      watchPath: "/src/service2",
      srcOpenApiPath: "/src/service2/index.yml",
      distOpenApiPath: "/dist/service2/openapi.yml",
      distTsSchemaPath: "/dist/service2/schema.d.ts",
    },
  ],
};

export default config;
