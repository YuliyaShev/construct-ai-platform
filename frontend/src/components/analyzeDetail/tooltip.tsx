"use client";

import React, { createContext, useContext, useMemo, useRef, useState } from "react";

type TooltipContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const value = useMemo(() => ({ open, setOpen, triggerRef }), [open]);
  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
};

export const TooltipTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const ctx = useContext(TooltipContext);
  if (!ctx) return children;

  const triggerProps = {
    ref: ctx.triggerRef as any,
    onMouseEnter: () => ctx.setOpen(true),
    onMouseLeave: () => ctx.setOpen(false)
  };

  if (asChild) {
    return React.cloneElement(children, triggerProps);
  }
  return (
    <span {...triggerProps} className="inline-block">
      {children}
    </span>
  );
};

export const TooltipContent = ({
  children,
  className,
  side = "top"
}: {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}) => {
  const ctx = useContext(TooltipContext);
  if (!ctx || !ctx.open || !ctx.triggerRef.current) return null;

  const rect = ctx.triggerRef.current.getBoundingClientRect();
  const style: React.CSSProperties = {
    position: "fixed",
    zIndex: 50,
    padding: "6px 10px",
    borderRadius: "6px",
    background: "#0f172a",
    color: "#fff",
    fontSize: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    pointerEvents: "none"
  };

  const offset = 8;
  if (side === "top") {
    style.left = rect.left + rect.width / 2;
    style.top = rect.top - offset;
    style.transform = "translate(-50%, -100%)";
  } else if (side === "bottom") {
    style.left = rect.left + rect.width / 2;
    style.top = rect.bottom + offset;
    style.transform = "translate(-50%, 0)";
  } else if (side === "left") {
    style.left = rect.left - offset;
    style.top = rect.top + rect.height / 2;
    style.transform = "translate(-100%, -50%)";
  } else {
    style.left = rect.right + offset;
    style.top = rect.top + rect.height / 2;
    style.transform = "translate(0, -50%)";
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
