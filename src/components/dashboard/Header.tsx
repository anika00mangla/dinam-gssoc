// 1. Add at the top
import { useEffect, useRef, useState } from "react";

// 2. Inside the component
const searchRef = useRef<HTMLInputElement>(null);
const [isFocused, setIsFocused] = useState(false);

// 3. Add the keyboard listener
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key === "k")) {
      e.preventDefault();
      searchRef.current?.focus();
    }
  };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}, []);

// 4. Update your search input JSX
<div style={{ position: "relative" }}>
  <input
    ref={searchRef}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
    onKeyDown={(e) => e.key === "Escape" && e.currentTarget.blur()}
    placeholder="Search..."
    // ...existing props
  />
  {!isFocused && (
    <kbd style={{
      position: "absolute",
      right: "8px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "11px",
      opacity: 0.5,
      border: "0.5px solid currentColor",
      borderRadius: "4px",
      padding: "1px 5px",
    }}>/</kbd>
  )}
</div>