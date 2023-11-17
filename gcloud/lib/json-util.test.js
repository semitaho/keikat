import { describe } from "node:test";
import { navigateFromJson, navigateFromJsonPaths } from "./json-util";
import testObject from "./test-jsons/projects-hiq.json";
import finitecJson from "./test-jsons/project-finitec.json";

import gig from "./test-jsons/project-gofore.json";

describe("json-util test", () => {
  describe("with gofore project gig json", () => {
    const data = JSON.parse(JSON.stringify(gig));

    it("should parse skills successfully", () => {

      const skills = navigateFromJson(data, "$.items..required_skills..name");
    });
  });

  describe("with hiq projects json", () => {
    const hiqData = JSON.parse(JSON.stringify(testObject));
    it("all items should have id", () => {
      const jobs = navigateFromJson(
        hiqData,
        "$.result.data.contentfulPartnersPage.jobCategories[*].jobs[*]"
      );
      expect(jobs.length).toBeGreaterThan(0);
      jobs.forEach((job) => {
        expect(job.id).toBeDefined();
      });
    });

    it("should have 3 items", () => {
      const jobs = navigateFromJsonPaths(hiqData, [
        "$.result.data.contentfulPartnersPage.jobCategories[*].jobs[*]",
      ]);

      expect(jobs.length).toBe(3);
    });
  });


  describe("with finitec project", () => {
    const finitec = JSON.parse(JSON.stringify(finitecJson));
    it("title found", () => {
      const title = navigateFromJson(finitec, "$.pageProps.gig['description_en','description_fi'].title", true);
      expect(title).toBe("ISO27001 Specialist");
    });
  });
});
