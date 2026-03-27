function Button({
  variant = "primary",
  tone,
  isLoading = false,
  className = "",
  children,
  ...props
}) {
  const classes = ["button", `button-${variant}`];

  if (variant === "icon" && tone) {
    classes.push(`button-icon-${tone}`);
  }

  if (className) {
    classes.push(className);
  }

  return (
    <button
      {...props}
      className={classes.join(" ")}
      disabled={props.disabled || isLoading}
      aria-busy={isLoading}
    >
      {children}
    </button>
  );
}

export default Button;
