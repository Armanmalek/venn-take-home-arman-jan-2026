const OnboardingLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="antialiased">{children}</div>;
};

export default OnboardingLayout;
