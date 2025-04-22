import dotenv from 'dotenv';
dotenv.config();

interface ApiConfig {
  tibiaDataApiUrl: string;
}

const config: ApiConfig = {
  tibiaDataApiUrl: process.env.TIBIADATA_API_URL || 'https://api.tibiadata.com',
};

export default config; 