import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Add shared FeatureGrid/FeatureCard used in AboutUsPage but previously found in card.jsx?
// The grep showed: import { FeatureGrid } from "../../components/ui/card";
// So I must restore those exports too. They are likely custom or just Grid wrappers.
// I'll add simple implementations for them to avoid breaking imports.

const FeatureGrid = ({ className, ...props }) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)} {...props} />
)

const FeatureCard = ({ className, children, ...props }) => (
  <Card className={cn("hover:shadow-lg transition-shadow duration-300", className)} {...props}>
    <CardContent className="p-6">{children}</CardContent>
  </Card>
)

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, FeatureGrid, FeatureCard }
