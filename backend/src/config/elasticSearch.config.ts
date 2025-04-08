export const elasticSearchConfig = {
    node: process.env.ELASTIC_CLOUD_ID as string,
  auth: {
    apiKey: process.env.PASSWORD as string
  }
};
