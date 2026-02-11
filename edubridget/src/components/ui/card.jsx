import React from "react";

/**
 * A generic grid component that takes a list of data
 * and a render function to display items.
 */
const FeatureGrid = ({
  items = [],
  renderItem,
  columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gap = "gap-8",
  className = "",
}) => {
  if (!items.length) return null;

  return (
    <div className={`grid ${columns} ${gap} ${className}`}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};

/**
 * The individual UI card logic.
 * Decoupled so you can use it inside or outside a grid.
 */
const FeatureCard = ({
  icon,
  title,
  description,
  bgColor = "#EDF2F7",
  iconBgColor = "bg-primary/20",
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 p-8 border border-slate-200 group cursor-pointer ${className}`}
      style={{ backgroundColor: bgColor }}>
      {/* Icon container */}
      <div className="mb-5 group-hover:scale-110 transition-transform duration-300">
        <div
          className={`w-14 h-14 ${iconBgColor} rounded-2xl flex items-center justify-center text-primary`}>
          {icon}
        </div>
      </div>

      <h3 className="font-bold text-xl mb-3 text-slate-800">{title}</h3>

      <p className="text-slate-700 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const Card = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`rounded-xl border bg-white text-slate-950 shadow-sm ${className}`}
      {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { FeatureGrid, FeatureCard, Card, CardContent };
