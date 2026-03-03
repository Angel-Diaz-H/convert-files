const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Carpetas de entrada y salida.
const inputFolder: string = path.join(__dirname, "original-images");
const outputFolder: string = path.join(__dirname, "webp-images");

if (!fs.existsSync(inputFolder)) {
  fs.mkdirSync(inputFolder, { recursive: true });
  console.log(
    `Se creó la carpeta "${inputFolder}". Por favor, coloca tus imágenes ahí y vuelve a ejecutar.`,
  );
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Leer carpeta.
fs.readdir(inputFolder, (err: string | null, files: string[]) => {
  if (err) {
    return console.error("Error al leer la carpeta de origen:", err);
  }

  // Filtrar imágenes.
  const images = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg"].includes(ext);
  });

  if (images.length === 0) {
    console.log(
      "No se encontraron imágenes PNG o JPG en la carpeta de origen.",
    );
    return;
  }

  console.log(`Iniciando la conversión de ${images.length} imágenes...`);

  // Procesa cada imagen.
  images.forEach((file) => {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, `${baseName}.webp`);

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => {
        console.log(`Convertido: ${file} -> ${baseName}.webp`);
      })
      .catch((err: string) => {
        console.error(`Error al convertir ${file}:`, err);
      });
  });
});
