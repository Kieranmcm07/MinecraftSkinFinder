const https = require("https");

exports.handler = async (event, context) => {
  const { username } = event.queryStringParameters;

  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Username is required" }),
    };
  }

  try {
    const url = `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(
      username
    )}`;

    const data = await new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let body = "";

          res.on("data", (chunk) => {
            body += chunk;
          });

          res.on("end", () => {
            if (res.statusCode === 204 || res.statusCode >= 400) {
              reject(new Error("Player not found"));
            } else {
              resolve(JSON.parse(body));
            }
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching player data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
