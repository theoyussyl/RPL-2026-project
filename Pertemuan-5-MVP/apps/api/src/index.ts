import "dotenv/config";
import { App } from "./app";

const Port = process.env.PORT || 4000;

App.listen(Port, () => {
  console.log(`API berjalan di http://localhost:${Port}`);
});
