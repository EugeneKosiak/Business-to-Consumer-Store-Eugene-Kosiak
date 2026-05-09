"use client";

export default function ToggleButton({ title }: { title: string }) {
  return (
    <button onClick={() => alert(`Toggled active state for "${title}"`)}>
      Toggle Active
    </button>
  );
}
