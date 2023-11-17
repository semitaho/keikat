import { describe } from "node:test";
import { navigateFromJson, navigateFromJsonPaths } from "./json-util";
import testObject from "./test-jsons/projects-hiq.json";
import finitecJson from "./test-jsons/project-finitec.json";


import { parseRegexp } from "./parser-util";

describe("parser-util test", () => {
  describe("with regexp", () => {
    it("should parse skills successfully", () => {
      expect(
        parseRegexp(
          "Consultant task – Full Stack Data Engineer (Espoo), published: 30.10.2023",
          /\d+\.\d+\.\d+/
        )
      ).toEqual("30.10.2023");
    });
  });
});
