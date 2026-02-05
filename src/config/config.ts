export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/testTask',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
  },
};
