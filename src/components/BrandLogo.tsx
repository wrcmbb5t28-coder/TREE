/** Treename.ai logo (tree mark + wordmark). Height is set in CSS via .brand-logo. */
export default function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="brand-logo"
      src="/brand/treename-logo.png"
      srcSet="/brand/treename-logo.png 1x, /brand/treename-logo@2x.png 2x"
      width={429}
      height={96}
      alt="Treename.ai"
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
