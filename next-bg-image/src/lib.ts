export default function getImageData(srcSet: string): Array<{
  width: number;
  url: string;
}> {
  const urls = srcSet.split(/,\s*/g).map((str) => str.split(/\s/)[0] ?? ``) ?? [];
  return urls
    .filter((urls) => urls.trim())
    .map((url) => {
      const urlObj = new URL(`https://example.com` + url);
      return { width: Number(urlObj.searchParams.get(`w`)), url };
    });
}
