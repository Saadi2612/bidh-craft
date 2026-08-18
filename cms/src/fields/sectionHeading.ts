import type { Field } from "payload";

type Defaults = { eyebrow?: string; title?: string; sub?: string };

/** The eyebrow / heading / subheading trio that sits above most site sections. */
export function sectionHeading(
  name: string,
  label: string,
  defaults: Defaults = {},
  opts: { withSub?: boolean } = {},
): Field {
  const withSub = opts.withSub ?? true;
  return {
    name,
    type: "group",
    label,
    fields: [
      {
        name: "eyebrow",
        type: "text",
        required: true,
        ...(defaults.eyebrow ? { defaultValue: defaults.eyebrow } : {}),
        admin: { description: "Small uppercase line above the heading." },
      },
      {
        name: "title",
        type: "text",
        required: true,
        ...(defaults.title ? { defaultValue: defaults.title } : {}),
      },
      ...(withSub
        ? ([
            {
              name: "sub",
              type: "textarea",
              ...(defaults.sub ? { defaultValue: defaults.sub } : {}),
              admin: { description: "Optional supporting line. Leave blank to hide." },
            },
          ] as Field[])
        : []),
    ],
  };
}
