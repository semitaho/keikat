import { describe } from "node:test";
import { navigateFromJsonPaths } from "./json-util";
import testObject from "./test-jsons/projects-hiq.json";
import gig from './test-jsons/project-gofore.json';

describe("json-util test", () => {
  describe("with gofore project gig json", () => {
    it("should parse skills successfully", () => {
      const skills = navigateFromJsonPaths(gig, ["required_skills.name"]);
    });
  });
  describe("with hiq projects json", () => {
    it("all items should have id", () => {
      const jobs = navigateFromJsonPaths(testObject, [
        "result.data.contentfulPartnersPage.jobCategories.jobs",
      ]);
      expect(jobs.length).toBeGreaterThan(0);
      console.log('voihan jobs', jobs);
      jobs.forEach((job) => {
        expect(job.id).toBeDefined();
      });
    });

    it("should have 3 items", () => {
      const jobs = navigateFromJsonPaths(testObject, [
        "result.data.contentfulPartnersPage.jobCategories.jobs",
      ]);
      expect(jobs.length).toBe(3);
    });
  });
});
