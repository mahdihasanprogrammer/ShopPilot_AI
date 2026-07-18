import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, Db, ObjectId } from "mongodb";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// ---- TypeScript Interfaces ----

export interface User {
  _id?: ObjectId;
  id: string; // Better Auth ID
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface Review {
  userId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Product {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  images: string[];
  ownerId?: string;
  rating?: number;
  reviews?: Review[];
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  _id?: ObjectId;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  stripePaymentIntentId?: string;
  createdAt: Date;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  _id?: ObjectId;
  userId: string;
  conversationId: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface ContactMessage {
  _id?: ObjectId;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

// Extend Express Request interface to hold the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// ---- MongoDB Connection Singleton ----

let client: MongoClient | null = null;
let db: Db | null = null;

async function getDatabase(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const dbName = process.env.DATABASE_NAME || "shoppilot_db";
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`Successfully connected to MongoDB database: ${dbName}`);
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Initialize database connection on startup
getDatabase().catch((err) => console.error("Initial DB connection failed:", err));

// ---- Standard Response Helper ----

function sendResponse(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null,
  error: any = null
) {
  return res.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
}

// ---- Authentication Middlewares ----

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Extract session token from Authorization Header or Cookies
    let token = "";
    
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    
    // If not found in header, check Cookies
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
        const [key, val] = cookie.trim().split("=");
        acc[key] = val;
        return acc;
      }, {} as Record<string, string>);
      token = cookies["better-auth.session_token"] || cookies["better-auth.session-token"];
    }

    if (!token) {
      return sendResponse(res, 401, false, "Unauthorized. Session token is missing.");
    }

    // 2. Early development mock fallbacks
    if (token === "demo-admin-token") {
      req.user = {
        id: "demo-admin-id",
        name: "Demo Admin",
        email: "admin@shoppilot.com",
        role: "admin",
        createdAt: new Date(),
      };
      return next();
    }

    if (token === "demo-user-token") {
      req.user = {
        id: "demo-user-id",
        name: "Demo User",
        email: "user@shoppilot.com",
        role: "user",
        createdAt: new Date(),
      };
      return next();
    }

    // 3. Query Better Auth session database collection
    const database = await getDatabase();
    
    // Locate active session matching session token
    const session = await database.collection("session").findOne({ token });
    if (!session) {
      return sendResponse(res, 401, false, "Invalid session token.");
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      return sendResponse(res, 401, false, "Session has expired.");
    }

    // Query matching user
    const userDoc = await database.collection("user").findOne({ id: session.userId });
    if (!userDoc) {
      return sendResponse(res, 401, false, "User not found.");
    }

    req.user = userDoc as unknown as User;
    next();
  } catch (error: any) {
    console.error("Authentication middleware error:", error);
    return sendResponse(res, 500, false, "Authentication check failed.", null, error.message);
  }
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // First run authentication check
  requireAuth(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return sendResponse(res, 403, false, "Forbidden. Admin access required.");
    }
    next();
  });
}

// ---- Route Handlers ----

// Base API status route
app.get("/api/health", async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const isDbConnected = !!database;
    return sendResponse(res, 200, true, "ShopPilot API is healthy", {
      databaseConnected: isDbConnected,
      timestamp: new Date()
    });
  } catch (error: any) {
    return sendResponse(res, 500, false, "ShopPilot API is unhealthy", null, error.message);
  }
});

// Better Auth Mount Placeholder
app.all("/api/auth/*", (req: Request, res: Response) => {
  return sendResponse(res, 200, true, "Better Auth endpoint handler placeholder.");
});

// ---- Products Routes ----

app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    
    // Parse filters
    const category = req.query.category as string;
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    const search = req.query.search as string;
    
    // Parse pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Parse sorting
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = (req.query.order as string) === "asc" ? 1 : -1;

    // Build query conditions
    const query: any = {};
    if (category) query.category = category;
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } }
      ];
    }

    const products = await database.collection("products")
      .find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await database.collection("products").countDocuments(query);

    return sendResponse(res, 200, true, "Products fetched successfully", {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to fetch products.", null, error.message);
  }
});

app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const id = req.params.id;

    // Handle both ObjectId and string IDs
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    const product = await database.collection("products").findOne(query);

    if (!product) {
      return sendResponse(res, 404, false, "Product not found.");
    }

    return sendResponse(res, 200, true, "Product fetched successfully", product);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to fetch product details.", null, error.message);
  }
});

app.post("/api/products", requireAdmin, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const { title, shortDescription, fullDescription, price, category, images } = req.body;

    if (!title || !price || !category) {
      return sendResponse(res, 400, false, "Title, price, and category are required.");
    }

    const newProduct: Product = {
      title,
      shortDescription: shortDescription || "",
      fullDescription: fullDescription || "",
      price: parseFloat(price),
      category,
      images: images || [],
      ownerId: req.user?.id,
      rating: 5,
      reviews: [],
      createdAt: new Date()
    };

    const result = await database.collection("products").insertOne(newProduct);
    const createdProduct = { ...newProduct, _id: result.insertedId };

    return sendResponse(res, 201, true, "Product created successfully", createdProduct);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to create product.", null, error.message);
  }
});

app.patch("/api/products/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const id = req.params.id;
    const updates = req.body;

    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    const product = await database.collection("products").findOne(query);

    if (!product) {
      return sendResponse(res, 404, false, "Product not found.");
    }

    // Clean fields
    delete updates._id;
    if (updates.price) updates.price = parseFloat(updates.price);

    await database.collection("products").updateOne(query, { $set: updates });
    const updatedDoc = await database.collection("products").findOne(query);

    return sendResponse(res, 200, true, "Product updated successfully", updatedDoc);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to update product.", null, error.message);
  }
});

app.delete("/api/products/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const id = req.params.id;

    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    const result = await database.collection("products").deleteOne(query);

    if (result.deletedCount === 0) {
      return sendResponse(res, 404, false, "Product not found or already deleted.");
    }

    return sendResponse(res, 200, true, "Product deleted successfully");
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to delete product.", null, error.message);
  }
});

// ---- Orders Routes ----

app.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const user = req.user!;

    // Admins see all orders, regular users only see their own
    const query = user.role === "admin" ? {} : { userId: user.id };
    
    const orders = await database.collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return sendResponse(res, 200, true, "Orders fetched successfully", orders);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to fetch orders.", null, error.message);
  }
});

app.post("/api/orders", requireAuth, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const { items, totalAmount, stripePaymentIntentId } = req.body;

    if (!items || !items.length || !totalAmount) {
      return sendResponse(res, 400, false, "Order items and total amount are required.");
    }

    const newOrder: Order = {
      userId: req.user!.id,
      items,
      totalAmount: parseFloat(totalAmount),
      status: "pending",
      stripePaymentIntentId,
      createdAt: new Date()
    };

    const result = await database.collection("orders").insertOne(newOrder);
    const createdOrder = { ...newOrder, _id: result.insertedId };

    return sendResponse(res, 201, true, "Order created successfully", createdOrder);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to place order.", null, error.message);
  }
});

// ---- Admin Analytics Routes ----

app.get("/api/orders/analytics/revenue", requireAdmin, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    
    // Group sales revenue by date (last 30 days)
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const stats = await database.collection("orders").aggregate(pipeline).toArray();
    
    // Format response data for Recharts
    const chartData = stats.map(item => ({
      date: item._id,
      revenue: item.revenue,
      orders: item.ordersCount
    }));

    return sendResponse(res, 200, true, "Revenue analytics fetched successfully", chartData);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to compile revenue analytics.", null, error.message);
  }
});

app.get("/api/orders/analytics/by-category", requireAdmin, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    
    // Sum quantities sold grouped by product category
    const pipeline = [
      { $unwind: "$items" },
      {
        // Lookup category from products collection (since orders only cache basic info)
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "id", // or _id depending on matching
          as: "productDetails"
        }
      },
      {
        $group: {
          _id: { $ifNull: [ { $arrayElemAt: ["$productDetails.category", 0] }, "General" ] },
          value: { $sum: { $multiply: ["$items.price", "$items.qty"] } }
        }
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0
        }
      }
    ];

    const categoryStats = await database.collection("orders").aggregate(pipeline).toArray();
    return sendResponse(res, 200, true, "Category sales analytics fetched successfully", categoryStats);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to compile category analytics.", null, error.message);
  }
});

// ---- Payments Routes ----

app.post("/api/payments/create-payment-intent", requireAuth, async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return sendResponse(res, 400, false, "Amount is required.");
    }

    // Mock clientSecret setup for development before Stripe package wiring in Prompt 13
    const clientSecret = `pi_mock_intent_${new ObjectId().toString()}_secret_${Math.random().toString(36).substring(2)}`;
    
    return sendResponse(res, 200, true, "Payment intent created", {
      clientSecret,
      amount
    });
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to initiate payment intent.", null, error.message);
  }
});

app.post("/api/payments/webhook", (req: Request, res: Response) => {
  // Public webhook logic placeholder
  console.log("Payment webhook event received");
  return sendResponse(res, 200, true, "Stripe Webhook processed successfully.");
});

// ---- Agentic AI Routes ----

app.post("/api/ai/recommendations", requireAuth, async (req: Request, res: Response) => {
  try {
    // Recommendation logic placeholder (to be wired to Claude API in Prompt 14)
    const mockRecommendations = [
      {
        id: "mock-prod-1",
        title: "AI Smart Watch Pro",
        reason: "Based on your search patterns and interest in fitness trackers."
      },
      {
        id: "mock-prod-2",
        title: "Violet Noise Cancelling Earbuds",
        reason: "This matches your purchase history of wireless audio devices."
      }
    ];
    return sendResponse(res, 200, true, "Recommendations calculated", mockRecommendations);
  } catch (error: any) {
    return sendResponse(res, 500, false, "AI recommendation engine failed.", null, error.message);
  }
});

app.post("/api/ai/chat", requireAuth, async (req: Request, res: Response) => {
  try {
    // Conversational stream assistant placeholder (to be wired to Claude API in Prompt 15)
    return sendResponse(res, 200, true, "Chat endpoint initialized. Stream will connect here.");
  } catch (error: any) {
    return sendResponse(res, 500, false, "AI chat assistant failed.", null, error.message);
  }
});

// ---- Contact Routes ----

app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return sendResponse(res, 400, false, "Name, email, and message are required.");
    }

    const newMessage: ContactMessage = {
      name,
      email,
      message,
      createdAt: new Date()
    };

    const result = await database.collection("contact_messages").insertOne(newMessage);
    const savedMessage = { ...newMessage, _id: result.insertedId };

    return sendResponse(res, 201, true, "Contact message saved successfully", savedMessage);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to submit contact message.", null, error.message);
  }
});

// ---- Global Error Handling Middleware ----

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Global Error:", err);
  const statusCode = err.status || err.statusCode || 500;
  return sendResponse(res, statusCode, false, err.message || "Internal Server Error", null, err.stack);
});

// Local Development Server Listener
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running in local development mode on: http://localhost:${PORT}`);
  });
}

// Export app for Vercel Serverless environment
export default app;
