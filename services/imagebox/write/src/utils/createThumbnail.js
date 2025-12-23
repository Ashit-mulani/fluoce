import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import pdf from "pdf-poppler";

export const createThumbnail = async (buffer, mimeType, options = {}) => {
  const { width = 220, height = 220, format = "jpeg" } = options;

  if (mimeType.startsWith("image/")) {
    return sharp(buffer)
      .resize(width, height, { fit: "cover" })
      .toFormat(format)
      .toBuffer();
  }

  if (mimeType === "application/pdf") {
    try {
      const rand = Date.now();

      const pdfInputPath = join(tmpdir(), `pdf_input_${rand}.pdf`);
      const outPrefix = `pdf_thumb_${rand}`;
      const pdfOutputPath = join(tmpdir(), `${outPrefix}-1.jpg`);

      await writeFile(pdfInputPath, buffer);

      await pdf.convert(pdfInputPath, {
        format: "jpg",
        out_dir: tmpdir(),
        out_prefix: outPrefix,
        page: 1,
        quality: 95,
        scale: 2048,
      });

      const pageBuffer = await readFile(pdfOutputPath);

      const thumb = await sharp(pageBuffer)
        .resize(width, height, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      await unlink(pdfInputPath).catch(() => {});
      await unlink(pdfOutputPath).catch(() => {});

      return thumb;
    } catch (err) {
      console.log("PDF thumbnail error:", err.message);
      return null;
    }
  }

  return null;
};
