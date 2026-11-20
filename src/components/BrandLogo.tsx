/** Treename.ai logo (tree mark + wordmark). Height is set in CSS via .brand-logo. */
export default function BrandLogo({ priority = false, comic = false }: { priority?: boolean; comic?: boolean }) {
  if (comic) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="brand-logo" src="/brand/treename-logo-comic.png" srcSet="/brand/treename-logo-comic.png 1x, /brand/treename-logo-comic@2x.png 2x"
        width={213} height={46} alt="Treename" decoding="async" fetchPriority={priority ? "high" : undefined} />
    );
  }
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
