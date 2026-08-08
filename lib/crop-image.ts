import type { Area } from "react-easy-crop";

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

// Crops the given image to the pixel area selected in the cropper and
// returns the result as a Blob, resized so avatars aren't uploaded at
// arbitrary (potentially huge) source resolution.
export async function getCroppedImageBlob(
  imageSrc: string,
  cropAreaPixels: Area,
  fileType: string,
  outputSize = 512,
): Promise<Blob> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context.");

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropAreaPixels.width,
    cropAreaPixels.height,
    0,
    0,
    outputSize,
    outputSize,
  );

  const mimeType = fileType.startsWith("image/") ? fileType : "image/jpeg";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to crop image."));
      },
      mimeType,
      0.92,
    );
  });
}
