export default function getImgData(urls: string[]): Array<{
  width: number;
  url: string;
}> {
  return urls.map((url) => {
    const urlObj = new URL(`https://example.com` + url);
    return { width: Number(urlObj.searchParams.get(`w`)), url };
  });
}
