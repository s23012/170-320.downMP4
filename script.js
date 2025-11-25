const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
  log: true,
  corePath: './ffmpeg/ffmpeg-core.js'
});

const input = document.getElementById("fileInput");
const status = document.getElementById("status");
const downloadLink = document.getElementById("downloadLink");

input.addEventListener("change", async () => {
  const file = input.files[0];
  if (!file) return;

  status.textContent = "Loading FFmpeg (first time takes long)...";

  await ffmpeg.load();

  status.textContent = "Converting... Please wait.";

  const inputName = "input.mp4";
  const outputName = "output.mp4";

  ffmpeg.FS("writeFile", inputName, await fetchFile(file));

  // 170 × 320 にリサイズ
  await ffmpeg.run(
    "-i", inputName,
    "-vf", "scale=170:320",
    "-preset", "ultrafast",
    outputName
  );

  const data = ffmpeg.FS("readFile", outputName);

  const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
  const url = URL.createObjectURL(videoBlob);

  downloadLink.href = url;
  downloadLink.download = "converted_170x320.mp4";
  downloadLink.textContent = "Download Converted MP4";
  downloadLink.classList.remove("hidden");

  status.textContent = "Conversion Complete!";
});
