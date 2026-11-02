import { describe, expect, test } from "bun:test";
import { CHECKOUT_URL } from "./lp-content";

describe("Own commercial access", () => {
  test("does not configure any checkout before the owner supplies her own account", () => {
    expect(CHECKOUT_URL).toBeNull();
  });
});