/*
export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  // class helper that turns a list of classes into a single string
  // if one of the classes is an object, it will add the key if the value is truthy

  // e.g. cx("foo", "bar") => "foo bar"
  // e.g. cx("foo", { bar: true }) => "foo bar"
  return "";
}

export default cx;
*/

export function cx(...args: any[]): string {
  return args
    .flatMap((arg) => {
      if (!arg) return [];

      if (typeof arg === "string") return [arg];

      if (typeof arg === "object") {
        return Object.entries(arg)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key);
      }

      return [];
    })
    .join(" ");
}

