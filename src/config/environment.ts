import dotenv from "dotenv";
dotenv.config();

interface WorkdayConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  acessToken: string;
}

function validateConfig(): WorkdayConfig {
  const config = {
    clientId: process.env.WORKDAY_CLIENT_ID,
    clientSecret: process.env.WORKDAY_CLIENT_SECRET,
    refreshToken: process.env.WORKDAY_REFRESH_TOKEN,
    acessToken:process.env.WORKDAY_ACESSTOKEN,
  };

  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Required Workday credentials not found in environment variables: ${missingVars.join(", ")}`
    );
  }

  return config as WorkdayConfig;
}

export const workdayConfig = validateConfig(); 