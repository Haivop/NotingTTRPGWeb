const app = require("./src/app/app");

const { loadEnvFile } = require('node:process');
loadEnvFile("./config/.env");

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
    return;
});





