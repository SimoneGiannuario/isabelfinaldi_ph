import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getOptimizedUrl } from "../../data/photos";

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  name?: string;
  image?: string;
  url?: string;
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  type = "website",
  name = "Naitiry",
  image = "/images/logo1.webp",
  url,
  noindex = false,
}: SEOProps) {
  const location = useLocation();
  const currentUrl = url || `https://naitiry.com${location.pathname}`;
  const fullImage = image.startsWith("http") ? image : getOptimizedUrl(`${import.meta.env.BASE_URL}images/logo1.webp`, 1440);

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
}
