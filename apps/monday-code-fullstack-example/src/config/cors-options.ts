import allowedOrigins from './allowed-origins';

interface CorsOptions {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;
  credentials: boolean;
  optionsSuccessStatus: number;
}

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else if (allowedOrigins.indexOf(origin) !== -1) {
      // Allow requests from predefined origins
      callback(null, true);
    } else if (origin.match(/^https:\/\/.*\.monday\.app$/)) {
      // Allow requests from any subdomain of us.monday.app
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
