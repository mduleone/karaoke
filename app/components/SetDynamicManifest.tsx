'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import manifest from '../manifest.template.json';

const generateDynamicManifestUrl = (path) => ({
  ...manifest,
  start_url: `/${path}`,
});

const setDynamicManifest = (manifestUrl: string) => {
  let manifest = document.querySelector('link[rel="manifest"]');
  if (manifest) {
    manifest.remove();
  }
  const link = document.createElement('link');
  link.setAttribute('rel', 'manifest');
  document.head.appendChild(link);
  manifest = document.querySelector('link[rel="manifest"]');
  manifest?.setAttribute('href', manifestUrl);
};

const SetDynamicManifestUrl = () => {
  const pathname = usePathname();
  useEffect(() => {
    const path = pathname.split('/')[1];
    const stringManifest = JSON.stringify(generateDynamicManifestUrl(path));
    const manifestURL = 'data:application/json;charset=utf-8,' + encodeURIComponent(stringManifest);
    setDynamicManifest(manifestURL);

    return () => {
      const stringManifest = JSON.stringify(generateDynamicManifestUrl(''));
      const manifestURL = 'data:application/json;charset=utf-8,' + encodeURIComponent(stringManifest);
      setDynamicManifest(manifestURL);
    };
  }, [pathname]);

  return null;
};

export default SetDynamicManifestUrl;
