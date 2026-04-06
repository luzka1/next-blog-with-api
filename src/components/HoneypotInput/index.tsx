export function HoneypotInput() {
  return (
    <input
      className="niceInput"
      type="text"
      name="dateUpdatedAt"
      autoComplete="new-password"
      tabIndex={-1}
      defaultValue=""
    ></input>
  );
}
