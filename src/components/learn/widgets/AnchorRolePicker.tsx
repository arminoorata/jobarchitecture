"use client";

import { useId } from "react";
import { anchorRoles } from "@/data/anchor-roles";
import { WidgetFrame } from "./WidgetFrame";

type Props = {
  value: string | null;
  onChange: (id: string) => void;
};

/**
 * Three anchor-role cards as a radio group.
 *
 * Inputs: `value` (currently selected role id, or null) and `onChange`.
 * Outputs: a `<fieldset>` with three `<label>` cards wrapping native radio
 * inputs. Selected card uses `accent-soft` background.
 *
 * Fallback: same UI, no transitions. Static rendering still gives keyboard
 * users a working radio group.
 */
export function AnchorRolePicker({ value, onChange }: Props) {
  return (
    <WidgetFrame
      caption="Pick an anchor role"
      fallback={<RolePickerCards value={value} onChange={onChange} animate={false} />}
    >
      <RolePickerCards value={value} onChange={onChange} animate />
    </WidgetFrame>
  );
}

function RolePickerCards({
  value,
  onChange,
  animate,
}: {
  value: string | null;
  onChange: (id: string) => void;
  animate: boolean;
}) {
  const groupId = useId();
  return (
    <fieldset>
      <legend className="text-sm font-semibold leading-6">
        Three sample roles, three different shapes of work.
      </legend>
      <p
        className="mt-1 text-xs leading-5"
        style={{ color: "var(--text-muted)" }}
      >
        Pick one to anchor the rest of the page.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {anchorRoles.map((role) => {
          const selected = value === role.id;
          return (
            <label
              key={role.id}
              className="flex cursor-pointer flex-col gap-2 rounded-[var(--radius-card)] border p-3 focus-within:outline-2 focus-within:outline-offset-2"
              style={{
                background: selected ? "var(--accent-soft)" : "var(--surface-alt)",
                borderColor: selected ? "var(--accent)" : "var(--line)",
                color: "var(--text)",
                outlineColor: "var(--accent)",
                transition: animate ? "background 160ms ease, border-color 160ms ease" : "none",
                minHeight: "44px",
              }}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name={groupId}
                  value={role.id}
                  checked={selected}
                  onChange={() => onChange(role.id)}
                  className="h-4 w-4 accent-current"
                  style={{ accentColor: "var(--accent)" }}
                />
                <span className="text-sm font-semibold">{role.title}</span>
              </span>
              <span
                className="text-xs leading-5"
                style={{ color: "var(--muted)" }}
              >
                {role.function} · {role.family}
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: "var(--accent)" }}
              >
                {role.level}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
