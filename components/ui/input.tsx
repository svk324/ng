import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, placeholder, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Focus input when the placeholder is clicked
    const handlePlaceholderClick = () => {
      inputRef.current?.focus();
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          placeholder={placeholder}
          className={cn(
            "peer flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-ring  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-transparent placeholder-shown:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                el;
          }}
          {...props}
        />
        <span
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base text-muted-foreground transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-foreground peer-focus:bg-background px-1 cursor-pointer"
          onClick={handlePlaceholderClick} // Clickable placeholder to focus the input
        >
          {placeholder}
        </span>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
