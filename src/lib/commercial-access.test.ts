import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { CHECKOUT_URL } from "./lp-content";

describe("Own commercial access", () => {
  it("does not configure any checkout before the owner supplies her own account", () => {
    assert.equal(CHECKOUT_URL, null);
  });
});