import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}

const SEOHead = ({ title, description, keywords, ogImage, url }: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    if (ogImage) setMeta("og:image", ogImage, true);
    if (url) setMeta("og:url", url, true);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);
  }, [title, description, keywords, ogImage, url]);

  return null;
};

export default SEOHead;
