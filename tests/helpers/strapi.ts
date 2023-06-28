import Strapi from "@strapi/strapi";
import fs from "fs";

let instance;

export async function setupStrapi() {
    const appDir = process.cwd();
    console.log(`appDir: ${appDir}`)

    console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
    process.env.NODE_ENV = 'localtest'
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

    if (!instance) {
        await Strapi({"distDir": appDir + "/dist"}).load();
        instance = strapi;

        await instance.server.mount();
    }
    return instance;
}

export async function cleanupStrapi() {
    const dbSettings = strapi.config.get("database.connection");

    //close server to release the db-file
    await strapi.server.httpServer.close();

    // close the connection to the database before deletion
    await strapi.db.connection.destroy();

    //delete test database after all tests have completed
    if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
        const tmpDbFile = dbSettings.connection.filename;
        if (fs.existsSync(tmpDbFile)) {
            fs.unlinkSync(tmpDbFile);
        }
    }
}