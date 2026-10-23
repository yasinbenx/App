import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setAudioCodec("aac");
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
// Software-WebGL, damit @remotion/three auch ohne GPU (Server/CI) rendert.
Config.setChromiumOpenGlRenderer("swangle");

// Optional: eigenes Chrome Headless Shell (z. B. in Sandboxes ohne Download-Zugriff).
// Lokal einfach weglassen, Remotion lädt dann sein eigenes Chrome.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
