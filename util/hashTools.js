exports.complexHash = (str) => {
  const prime1 = 31;
  const prime2 = 37;
  const prime3 = 41;
  const mod1 = 1000000007;
  const mod2 = 1000000009;
  const mod3 = 1000000021;

  let hash1 = 0;
  let hash2 = 1;
  let hash3 = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 * prime1 + char) % mod1;
    hash2 = (hash2 * prime2 + char) % mod2;
    hash3 = (hash3 * prime3 + char) % mod3;
  }

  // Combine the hash values into a single string
  return `${hash1.toString(16).padStart(8, "0")}${hash2
    .toString(16)
    .padStart(8, "0")}${hash3.toString(16).padStart(8, "0")}`;
};
