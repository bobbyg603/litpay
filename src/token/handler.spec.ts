import { tokenHandler } from "./handler";

describe("tokenHandler", () => {
    it("should return a token", () => {
        tokenHandler(null, null, (err, response) => {
            expect(JSON.parse(response.body).token).toEqual("abc123");
        })
    });
})