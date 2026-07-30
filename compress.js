 const sharp = require('sharp');

async function generateFavicon() {
  await sharp("E:\\com\\com\\public\\c21162e3-31e1-41a8-bca9-66eb6c2fb32a.png")
    .resize(32, 32)
    .png()
    .toFile("E:\\com\\com\\public\\favicon.ico");

  console.log("✅ favicon.ico generated!");
}

generateFavicon().catch(console.error);