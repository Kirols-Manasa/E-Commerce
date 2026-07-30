 const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// المسارات الكاملة للصور
const images = [
  "E:\\com\\com\\public\\Accessories\\additional\\1Accessories\\image.png",
  "E:\\com\\com\\public\\Accessories\\additional\\2Accessories\\image.png",
  "E:\\com\\com\\public\\Accessories\\additional\\3Accessories\\image.png",
  "E:\\com\\com\\public\\Accessories\\additional\\4Accessories\\image.png",
  "E:\\com\\com\\public\\Accessories\\additional\\5Accessories\\image.png",
  "E:\\com\\com\\public\\Accessories\\additional\\6Accessories\\image.png",
  "E:\\com\\com\\public\\Accessories\\image1.png",
  "E:\\com\\com\\public\\Accessories\\image2.png",
  "E:\\com\\com\\public\\Accessories\\image3.png",
  "E:\\com\\com\\public\\Accessories\\image4.png",
  "E:\\com\\com\\public\\Accessories\\image5.png",
  "E:\\com\\com\\public\\Accessories\\image6.png",
  "E:\\com\\com\\public\\imgehero\\hero.png",
  "E:\\com\\com\\public\\man\\additional\\man1\\image copy 2.png",
  "E:\\com\\com\\public\\man\\additional\\man1\\image copy.png",
  "E:\\com\\com\\public\\man\\additional\\man1\\image.png",
  "E:\\com\\com\\public\\man\\additional\\man2\\image copy 2.png",
  "E:\\com\\com\\public\\man\\additional\\man2\\image copy.png",
  "E:\\com\\com\\public\\man\\additional\\man2\\image.png",
  "E:\\com\\com\\public\\man\\additional\\man3\\image copy 2.png",
  "E:\\com\\com\\public\\man\\additional\\man3\\image copy.png",
  "E:\\com\\com\\public\\man\\additional\\man3\\image.png",
  "E:\\com\\com\\public\\man\\additional\\man4\\image copy 2.png",
  "E:\\com\\com\\public\\man\\additional\\man4\\image copy.png",
  "E:\\com\\com\\public\\man\\additional\\man4\\image.png",
  "E:\\com\\com\\public\\man\\additional\\man5\\image copy 2.png",
  "E:\\com\\com\\public\\man\\additional\\man5\\image copy.png",
  "E:\\com\\com\\public\\man\\additional\\man5\\image.png",
  "E:\\com\\com\\public\\man\\additional\\man6\\image copy 2.png",
  "E:\\com\\com\\public\\man\\additional\\man6\\image copy.png",
  "E:\\com\\com\\public\\man\\additional\\man6\\image.png",
  "E:\\com\\com\\public\\man\\additional\\man7\\image copy 2.png",
  "E:\\com\\com\\public\\man\\additional\\man7\\image copy.png",
  "E:\\com\\com\\public\\man\\additional\\man7\\image.png",
  "E:\\com\\com\\public\\man\\additional\\man8\\image copy 2.png",
  "E:\\com\\com\\public\\man\\additional\\man8\\image copy.png",
  "E:\\com\\com\\public\\man\\additional\\man8\\image.png",
  "E:\\com\\com\\public\\man\\image1.png",
  "E:\\com\\com\\public\\man\\image2.png",
  "E:\\com\\com\\public\\man\\image3.png",
  "E:\\com\\com\\public\\man\\image4.png",
  "E:\\com\\com\\public\\man\\image5.png",
  "E:\\com\\com\\public\\man\\image6.png",
  "E:\\com\\com\\public\\man\\image7.png",
  "E:\\com\\com\\public\\man\\image8.png",
  "E:\\com\\com\\public\\SALE\\additional\\SALE1\\image.png",
  "E:\\com\\com\\public\\SALE\\additional\\SALE2\\image.png",
  "E:\\com\\com\\public\\SALE\\additional\\SALE3\\image.png",
  "E:\\com\\com\\public\\SALE\\additional\\SALE4\\image.png",
  "E:\\com\\com\\public\\SALE\\additional\\SALE5\\image.png",
  "E:\\com\\com\\public\\SALE\\additional\\SALE6\\image.png",
  "E:\\com\\com\\public\\SALE\\image1.png",
  "E:\\com\\com\\public\\SALE\\image2.png",
  "E:\\com\\com\\public\\SALE\\image3.png",
  "E:\\com\\com\\public\\SALE\\image4.png",
  "E:\\com\\com\\public\\SALE\\image5.png",
  "E:\\com\\com\\public\\SALE\\image6.png",
  "E:\\com\\com\\public\\SHOES\\additional\\SHOES1\\image.png",
  "E:\\com\\com\\public\\SHOES\\additional\\SHOES2\\image.png",
  "E:\\com\\com\\public\\SHOES\\additional\\SHOES3\\image.png",
  "E:\\com\\com\\public\\SHOES\\additional\\SHOES4\\image.png",
  "E:\\com\\com\\public\\SHOES\\additional\\SHOES5\\image.png",
  "E:\\com\\com\\public\\SHOES\\additional\\SHOES6\\image.png",
  "E:\\com\\com\\public\\SHOES\\image1.png",
  "E:\\com\\com\\public\\SHOES\\image2.png",
  "E:\\com\\com\\public\\SHOES\\image3.png",
  "E:\\com\\com\\public\\SHOES\\image4.png",
  "E:\\com\\com\\public\\SHOES\\image5.png",
  "E:\\com\\com\\public\\SHOES\\image6.png",
  "E:\\com\\com\\public\\women\\additional\\women1\\image copy 2.png",
  "E:\\com\\com\\public\\women\\additional\\women1\\image copy.png",
  "E:\\com\\com\\public\\women\\additional\\women1\\image.png",
  "E:\\com\\com\\public\\women\\additional\\women2\\image copy 2.png",
  "E:\\com\\com\\public\\women\\additional\\women2\\image copy.png",
  "E:\\com\\com\\public\\women\\additional\\women2\\image.png",
  "E:\\com\\com\\public\\women\\additional\\women3\\image copy 2.png",
  "E:\\com\\com\\public\\women\\additional\\women3\\image copy.png",
  "E:\\com\\com\\public\\women\\additional\\women3\\image.png",
  "E:\\com\\com\\public\\women\\additional\\women4\\image copy 2.png",
  "E:\\com\\com\\public\\women\\additional\\women4\\image copy.png",
  "E:\\com\\com\\public\\women\\additional\\women4\\image.png",
  "E:\\com\\com\\public\\women\\additional\\women5\\image copy 2.png",
  "E:\\com\\com\\public\\women\\additional\\women5\\image copy.png",
  "E:\\com\\com\\public\\women\\additional\\women5\\image.png",
  "E:\\com\\com\\public\\women\\additional\\women6\\image copy 2.png",
  "E:\\com\\com\\public\\women\\additional\\women6\\image copy.png",
  "E:\\com\\com\\public\\women\\additional\\women6\\image.png",
  "E:\\com\\com\\public\\women\\additional\\women7\\image copy 2.png",
  "E:\\com\\com\\public\\women\\additional\\women7\\image copy.png",
  "E:\\com\\com\\public\\women\\additional\\women7\\image.png",
  "E:\\com\\com\\public\\women\\additional\\women8\\image copy 2.png",
  "E:\\com\\com\\public\\women\\additional\\women8\\image copy.png",
  "E:\\com\\com\\public\\women\\additional\\women8\\image.png",
  "E:\\com\\com\\public\\women\\image1.png",
  "E:\\com\\com\\public\\women\\image2.png",
  "E:\\com\\com\\public\\women\\image3.png",
  "E:\\com\\com\\public\\women\\image4.png",
  "E:\\com\\com\\public\\women\\image5.png",
  "E:\\com\\com\\public\\women\\image6.png",
  "E:\\com\\com\\public\\women\\image7.png",
  "E:\\com\\com\\public\\women\\image8.png"
];

// متغيرات لتتبع الإحصائيات
let totalOriginalSize = 0;
let totalCompressedSize = 0;
let successCount = 0;
let errorCount = 0;

// دالة لتحويل صورة واحدة من PNG إلى WebP
async function convertToWebP(imagePath) {
  try {
    // التحقق من وجود الملف
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ الملف غير موجود: ${imagePath}`);
      errorCount++;
      return;
    }

    // الحصول على معلومات الملف الأصلي
    const stats = fs.statSync(imagePath);
    const originalSize = stats.size;
    totalOriginalSize += originalSize;

    // تحويل الصورة إلى WebP بجودة عالية
    const compressedBuffer = await sharp(imagePath)
      .webp({ quality: 80 })
      .toBuffer();

    const compressedSize = compressedBuffer.length;
    totalCompressedSize += compressedSize;

    // الحصول على مسار الملف الجديد (تغيير الامتداد من .png إلى .webp)
    const newPath = imagePath.replace(/\.png$/i, '.webp');

    // حفظ الصورة الجديدة بصيغة WebP
    fs.writeFileSync(newPath, compressedBuffer);

    // حذف الملف الأصلي PNG
    fs.unlinkSync(imagePath);

    // حساب نسبة الضغط
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
    console.log(`✅ ${imagePath} → ${newPath}`);
    console.log(`   الحجم الأصلي: ${(originalSize / 1024).toFixed(2)} KB | الحجم الجديد: ${(compressedSize / 1024).toFixed(2)} KB | توفير: ${reduction}%`);
    
    successCount++;
  } catch (error) {
    console.error(`❌ خطأ في تحويل ${imagePath}: ${error.message}`);
    errorCount++;
  }
}

// دالة رئيسية لتحويل جميع الصور
async function convertAllToWebP() {
  console.log("🚀 بدء تحويل الصور من PNG إلى WebP...\n");
  console.log(`📊 إجمالي الصور: ${images.length}\n`);

  // تحويل الصور واحدة تلو الأخرى
  for (const imagePath of images) {
    await convertToWebP(imagePath);
  }

  // طباعة الإحصائيات النهائية
  console.log("\n" + "=".repeat(60));
  console.log("📊 ملخص التحويل:");
  console.log("=".repeat(60));
  console.log(`✅ صور تم تحويلها بنجاح: ${successCount}`);
  console.log(`❌ صور حدث بها خطأ: ${errorCount}`);
  console.log(`\n📈 إجمالي الحجم الأصلي (PNG): ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📉 إجمالي الحجم الجديد (WebP): ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
  
  const totalReduction = totalOriginalSize - totalCompressedSize;
  const totalReductionPercent = ((totalReduction / totalOriginalSize) * 100).toFixed(2);
  
  console.log(`\n💾 المساحة المحفوظة: ${(totalReduction / 1024 / 1024).toFixed(2)} MB (${totalReductionPercent}%)`);
  console.log("=".repeat(60));
}

// تشغيل البرنامج
convertAllToWebP().catch(console.error);