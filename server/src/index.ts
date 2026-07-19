import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, Db, ObjectId } from "mongodb";
import Stripe from "stripe";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// ---- MongoDB Connection Singleton ----

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "shoppilot_db";

const client = new MongoClient(MONGODB_URI);
const db = client.db(DATABASE_NAME);

async function getDatabase(): Promise<Db> {
  return db;
}

// Connect to MongoDB and seed demo users
client.connect()
  .then(() => {
    console.log(`Connected to MongoDB: ${DATABASE_NAME}`);
  })
  .catch((err) => console.error("MongoDB connection failed:", err));

// ---- Auth Note ----
// Better Auth is configured inside the Next.js client app (src/lib/auth.ts).
// This Express server validates sessions by calling the Next.js auth endpoint.
// Demo accounts are seeded via POST /api/seed in the Next.js app.

// Apply express.json() for all API routes
app.use(express.json());

// ---- TypeScript Interfaces ----

export interface User {
  id: string; // Better Auth ID
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  createdAt: Date;
  userRole?: string;
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
// ---- Custom Token-based Authentication Middlewares ----

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return sendResponse(res, 401, false, "Unauthorized. No session token provided. Please sign in.");
    }

    const database = await getDatabase();
    
    // Find session by token in the session collection
    const session = await database.collection("session").findOne({ token });
    if (!session) {
      return sendResponse(res, 401, false, "Unauthorized. Invalid session token.");
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      return sendResponse(res, 401, false, "Unauthorized. Session token has expired.");
    }

    // Find user associated with the session userId
    const userId = session.userId;
    const userQuery = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { _id: userId };
    
    const user = await database.collection("user").findOne({
      $or: [
        userQuery,
        { id: userId }
      ]
    });

    if (!user) {
      return sendResponse(res, 401, false, "Unauthorized. Session user not found.");
    }

    // Attach user to req.user with role mapped to userRole
    req.user = {
      id: user.id || String(user._id),
      name: user.name,
      email: user.email,
      image: user.image || undefined,
      role: user.role || "user",
      userRole: user.role || "user",
      createdAt: new Date(user.createdAt || Date.now()),
    };

    next();
  } catch (error: any) {
    console.error("Token verification error:", error);
    return sendResponse(res, 500, false, "Token check failed.", null, error.message);
  }
}

function verifyUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.userRole !== "user") {
    return sendResponse(res, 403, false, "Forbidden. User role required.");
  }
  next();
}

function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.userRole !== "admin") {
    return sendResponse(res, 403, false, "Forbidden. Admin role required.");
  }
  next();
}

// Map compatibility helper wrappers
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  await verifyToken(req, res, next);
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await verifyToken(req, res, () => {
    verifyAdmin(req, res, next);
  });
}

// ---- Route Handlers ----

// Base API status route
app.get("/api/health", async (req: Request, res: Response) => {
  try {
    const isDbConnected = !!db;
    return sendResponse(res, 200, true, "ShopPilot API is healthy", {
      databaseConnected: isDbConnected,
      timestamp: new Date()
    });
  } catch (error: any) {
    return sendResponse(res, 500, false, "ShopPilot API is unhealthy", null, error.message);
  }
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
    if (category) query.category = { $regex: `^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" };
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

// Helper to decrement stock counts for ordered items
async function decrementProductStock(items: any[]) {
  try {
    const database = await getDatabase();
    for (const item of items) {
      const productId = item.productId;
      const qty = parseInt(item.qty) || 1;
      const query = ObjectId.isValid(productId) ? { _id: new ObjectId(productId) } : { id: productId };
      await database.collection("products").updateOne(query, { $inc: { stock: -qty } });
    }
  } catch (err: any) {
    console.error("Failed to decrement product stock:", err.message);
  }
}

app.post("/api/products", requireAdmin, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const { title, shortDescription, fullDescription, price, category, images, brand = "", stock = 10 } = req.body;

    if (!title || !price || !category) {
      return sendResponse(res, 400, false, "Title, price, and category are required.");
    }

    const newProduct = {
      title,
      shortDescription: shortDescription || "",
      fullDescription: fullDescription || "",
      price: parseFloat(price),
      category,
      brand,
      stock: parseInt(stock) || 0,
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

    delete updates._id;
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock) || 0;

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

    // If stripePaymentIntentId is supplied the payment already succeeded — store as "paid"
    const orderStatus = stripePaymentIntentId ? "paid" : "pending";

    const newOrder: Order = {
      userId: req.user!.id,
      items,
      totalAmount: parseFloat(totalAmount),
      status: orderStatus,
      stripePaymentIntentId,
      createdAt: new Date()
    };

    const result = await database.collection("orders").insertOne(newOrder);
    const createdOrder = { ...newOrder, _id: result.insertedId };

    // If order was paid immediately, decrement the products stock count
    if (orderStatus === "paid") {
      await decrementProductStock(items);
    }

    return sendResponse(res, 201, true, "Order created successfully", createdOrder);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to place order.", null, error.message);
  }
});

app.patch("/api/orders/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const id = req.params.id;
    const { status } = req.body;

    const validStatuses = ["pending", "paid", "shipped", "delivered"];
    if (!status || !validStatuses.includes(status)) {
      return sendResponse(res, 400, false, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id: id };
    const order = await database.collection("orders").findOne(query);

    if (!order) {
      return sendResponse(res, 404, false, "Order not found.");
    }

    await database.collection("orders").updateOne(query, { $set: { status } });
    const updatedDoc = await database.collection("orders").findOne(query);

    return sendResponse(res, 200, true, "Order status updated successfully", updatedDoc);
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to update order status.", null, error.message);
  }
});

// ---- Admin Analytics Routes ----

app.get("/api/orders/analytics/revenue", requireAdmin, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    
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
    
    const pipeline = [
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "id",
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
// Initialize Stripe only when the secret key is available (graceful fallback for test/dev)
const stripeClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

app.post("/api/payments/create-payment-intent", requireAuth, async (req: Request, res: Response) => {
  try {
    const { amount, currency = "usd" } = req.body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return sendResponse(res, 400, false, "A valid positive amount (in cents) is required.");
    }

    if (stripeClient) {
      // Real Stripe payment intent
      const intent = await stripeClient.paymentIntents.create({
        amount: Math.round(amount), // amount in cents
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: { userId: req.user!.id },
      });
      return sendResponse(res, 200, true, "Payment intent created", {
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
        amount: intent.amount,
      });
    } else {
      // Simulated intent for test environments without Stripe keys
      const mockId = `pi_test_${new ObjectId().toString()}`;
      const clientSecret = `${mockId}_secret_${Math.random().toString(36).substring(2, 15)}`;
      return sendResponse(res, 200, true, "Payment intent created (simulated)", {
        clientSecret,
        paymentIntentId: mockId,
        amount,
        simulated: true,
      });
    }
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to create payment intent.", null, error.message);
  }
});

// Webhook — verifies Stripe signature when STRIPE_WEBHOOK_SECRET is set
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (stripeClient && sig && webhookSecret) {
    try {
      const event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log("Stripe webhook event received:", event.type);

      if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object as Stripe.PaymentIntent;
        const database = await getDatabase();
        
        // Find existing order to verify it hasn't been set to paid yet (avoid double stock decrement)
        const order = await database.collection("orders").findOne({ stripePaymentIntentId: intent.id });
        if (order && order.status !== "paid") {
          await database.collection("orders").updateOne(
            { _id: order._id },
            { $set: { status: "paid" } }
          );
          // Decrement product stock levels
          await decrementProductStock(order.items);
        }
      }

      return sendResponse(res, 200, true, "Webhook processed", { type: event.type });
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return sendResponse(res, 400, false, "Webhook signature verification failed.");
    }
  }

  // Fallback: log and acknowledge without verification
  console.log("Stripe webhook received (no signature verification).");
  return sendResponse(res, 200, true, "Webhook received.");
});

// ---- Cart Routes ----

app.get("/api/cart", requireAuth, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const cart = await database.collection("carts").findOne({ userId: req.user!.id });
    return sendResponse(res, 200, true, "Cart retrieved successfully", cart || { items: [] });
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to retrieve cart.", null, error.message);
  }
});

app.post("/api/cart", requireAuth, async (req: Request, res: Response) => {
  try {
    const database = await getDatabase();
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return sendResponse(res, 400, false, "Items must be an array.");
    }
    await database.collection("carts").updateOne(
      { userId: req.user!.id },
      { $set: { items, updatedAt: new Date() } },
      { upsert: true }
    );
    return sendResponse(res, 200, true, "Cart updated successfully");
  } catch (error: any) {
    return sendResponse(res, 500, false, "Failed to update cart.", null, error.message);
  }
});

// ---- Agentic AI Routes ----

app.post("/api/ai/recommendations", requireAuth, async (req: Request, res: Response) => {
  try {
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
