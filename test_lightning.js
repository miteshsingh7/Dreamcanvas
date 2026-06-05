import { client } from "@gradio/client";
async function test() {
  try {
    const app = await client("ByteDance/SDXL-Lightning");
    const result = await app.predict("/generate_image", [
      "cyberpunk city",
      "2-Step",
    ]);
    console.log("Success:", result.data);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
