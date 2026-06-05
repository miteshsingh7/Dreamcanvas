import { client } from "@gradio/client";
async function test() {
  try {
    const app = await client("black-forest-labs/FLUX.1-schnell");
    console.log("Connected to Gradio space.");
    const result = await app.predict("/infer", [
      "cat",
      0,
      true,
      1024,
      1024,
      4
    ]);
    console.log("Success:", !!result.data[0]);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
