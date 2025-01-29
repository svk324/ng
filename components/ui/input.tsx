import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, placeholder, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={`
            w-full
            h-10
            px-3
            text-base
            font-medium
            border border-black
            rounded-md
            bg-white
            outline-none
            transition-all
            
            ${isFocused ? "border-2" : "border border-gray-200"}
            ${className || ""}`}
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                el;
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        <label
          className={`
            absolute
            left-3
            transition-all
            duration-200
            font-normal
            pointer-events-none
            ${
              isFocused || hasValue
                ? "-top-[7.5px] text-[10px] bg-white px-1 text-black font-light"
                : "top-2 text-gray-400"
            }`}
        >
          {placeholder}
        </label>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
