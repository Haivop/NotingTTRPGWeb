import app from "./src/app/app.js";
import { loadEnvFile } from 'node:process';

loadEnvFile("./config/.env");

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
    return;
});





