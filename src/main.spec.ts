import { main } from "./main";

describe("Main", () => {
  it("should return 'Hello World'", () => {
    const result = main();

    expect(result).toBe("Hello World");
  });
});
