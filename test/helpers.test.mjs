import { getDateStringForDeletion, getMessage } from "../src/utils/helpers.mjs";

describe("getDateStringForDeletion", () => {
  test("no change", () => {
    // months are 0-indexed, days are 1-indexed
    const date = new Date(Date.UTC(2020, 0, 1));
    expect(getDateStringForDeletion(date, 0)).toBe("2020-01-01");
  });
  test("within month", () => {
    const date = new Date(Date.UTC(2020, 0, 8));
    expect(getDateStringForDeletion(date, 7)).toBe("2020-01-01");
  });
  test("change month", () => {
    const date = new Date(Date.UTC(2020, 1, 1));
    expect(getDateStringForDeletion(date, 1)).toBe("2020-01-31");
  });
  test("change year", () => {
    const date = new Date(Date.UTC(2020, 0, 1));
    expect(getDateStringForDeletion(date, 1)).toBe("2019-12-31");
  });
});

describe("getMessage", () => {
  test("Short title", () => {
    const event = {
      name: "repo",
      url: "https://github.com/org/repo/pull/1234",
      number: "1234",
      author: "username",
      title: "Short PR title",
    };
    expect(getMessage(event)).toBe(
      "Merged: <https://github.com/org/repo/pull/1234|repo #1234 Short PR title> (by username)",
    );
  });
  test("Long title", () => {
    const event = {
      name: "repo",
      url: "https://github.com/org/repo/pull/1234",
      number: "1234",
      author: "username",
      title:
        "Surprisingly long pull request title that is really just too long to be comprehended something something.",
    };
    expect(getMessage(event)).toBe(
      "Merged: <https://github.com/org/repo/pull/1234|repo #1234 Surprisingly long pull request title that is really just too long to be comprehended something somet...> (by username)",
    );
  });
  test("Interpolating Jira cards", () => {
    const event = {
      name: "repo",
      url: "https://github.com/org/repo/pull/1234",
      number: "1234",
      author: "username",
      title: "[JIRA-1234] and another FOO-100",
    };
    expect(getMessage(event)).toBe(
      "Merged: <https://github.com/org/repo/pull/1234|repo #1234 [JIRA-1234] and another FOO-100> (by username), Jira: <https://jira.mydomain.com/browse/JIRA-1234|JIRA-1234>, <https://jira.mydomain.com/browse/FOO-100|FOO-100>",
    );
  });
});
