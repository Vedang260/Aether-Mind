export const elasticSearchConfig = {
    node: process.env.BONSAI_URL,
    auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
    },
};
