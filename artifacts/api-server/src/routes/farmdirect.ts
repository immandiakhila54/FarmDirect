import { Router, type IRouter } from "express";
import {
  CreateOrderBody,
  CreateProductBody,
  GetProductsQueryParams,
  LoginBody,
  UpdateOrderStatusBody,
  UpdateProductBody,
  UpdateProfileBody,
} from "@workspace/api-zod";

type Role = "farmer" | "customer";
type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "rejected";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone: string;
  location: string;
  farmName?: string;
  farmingType?: string;
  address?: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  location: string;
  harvestDate: string;
  image: string;
  organic: boolean;
  available: boolean;
  farmerId: string;
  farmerName: string;
  rating: number;
  reviews: number;
  createdAt: string;
};

type OrderItem = {
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
};

type Order = {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  city: string;
  pinCode: string;
  instructions: string;
  paymentMethod: string;
  date: string;
  estimatedDelivery: string;
  status: OrderStatus;
};

const farmers: User[] = [
  ["Ramesh Kumar", "farmer1", "Rangareddy", "Sahaja Farms", "Organic vegetables"],
  ["Suresh Reddy", "farmer2", "Medak", "Reddy Fresh Fields", "Natural farming"],
  ["Ravi Kumar", "farmer3", "Nalgonda", "Green Valley FPO", "Sustainable farming"],
  ["Mahesh Rao", "farmer4", "Warangal", "Rao Harvests", "Regenerative farming"],
  ["Srinivas", "farmer5", "Karimnagar", "Sri Lakshmi Farm", "Organic grains"],
  ["Prakash", "farmer6", "Vikarabad", "Prakash Produce", "Natural farming"],
  ["Anil Kumar", "farmer7", "Sangareddy", "Anil's Orchard", "Integrated farming"],
  ["Rajesh", "farmer8", "Khammam", "Krishna FPO", "Organic vegetables"],
  ["Venkat", "farmer9", "Mahbubnagar", "Venkat Farms", "Sustainable farming"],
  ["Naveen", "farmer10", "Adilabad", "Naveen Naturals", "Organic produce"],
].map(([name, key, location, farmName, farmingType], index) => ({
  id: `f-${index + 1}`,
  name,
  email: `${key}@farmdirect.com`,
  password: "farmer123",
  role: "farmer" as const,
  phone: `+91 98${String(10000000 + index * 79131).slice(-8)}`,
  location,
  farmName,
  farmingType,
  address: `${farmName}, ${location}, Telangana`,
}));

const customerNames = [
  "Akhil",
  "Priya",
  "Rahul",
  "Sneha",
  "Ananya",
  "Kiran",
  "Neha",
  "Arjun",
  "Divya",
  "Varun",
];
const customers: User[] = customerNames.map((name, index) => ({
  id: `c-${index + 1}`,
  name,
  email: `customer${index + 1}@farmdirect.com`,
  password: "customer123",
  role: "customer",
  phone: `+91 97${String(20000000 + index * 61417).slice(-8)}`,
  location: ["Hyderabad", "Secunderabad", "Gachibowli", "Kukatpally"][index % 4],
  address: `${12 + index}, Lake View Road`,
}));
const users = [...farmers, ...customers];

const productImages = [
  "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1568584711271-9f9ec0c8b2ce?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1598030343246-eec71cb4423e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1503940004885-8a4a4eb1aa71?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1583663848850-46af132dc08c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=85",
];
const productSeed = [
  ["Tomatoes", "Vegetables", 40, "kg", 250, true, 0],
  ["Potatoes", "Vegetables", 32, "kg", 340, false, 1],
  ["Red Onions", "Vegetables", 36, "kg", 280, true, 2],
  ["Carrots", "Vegetables", 48, "kg", 120, true, 3],
  ["Baby Spinach", "Vegetables", 55, "bunch", 84, true, 4],
  ["Green Chilli", "Spices", 70, "kg", 95, true, 5],
  ["Brinjal", "Vegetables", 44, "kg", 150, false, 6],
  ["Cauliflower", "Vegetables", 60, "piece", 75, true, 7],
  ["Cabbage", "Vegetables", 38, "kg", 180, false, 8],
  ["Alphonso Mangoes", "Fruits", 160, "kg", 92, true, 9],
  ["Robusta Bananas", "Fruits", 52, "dozen", 130, false, 10],
  ["Shimla Apples", "Fruits", 190, "kg", 65, false, 11],
  ["Sona Masuri Rice", "Grains", 78, "kg", 420, true, 12],
  ["Stoneground Wheat", "Grains", 58, "kg", 300, false, 13],
  ["Lakadong Turmeric", "Spices", 240, "kg", 48, true, 14],
  ["Fresh Coriander", "Spices", 25, "bunch", 110, true, 15],
  ["Green Peas", "Vegetables", 88, "kg", 72, true, 16],
  ["Groundnuts", "Pulses", 120, "kg", 190, false, 17],
  ["Sweet Sugarcane", "Other", 34, "kg", 500, false, 18],
  ["Desi Corn", "Grains", 62, "kg", 170, true, 19],
] as const;

let productSequence = productSeed.length + 1;
let orderSequence = 16;
const products: Product[] = productSeed.map(
  ([name, category, price, unit, quantity, organic, imageIndex], index) => {
    const farmer = farmers[index % farmers.length];
    return {
      id: `p-${index + 1}`,
      name,
      category,
      description: `${organic ? "Carefully grown without synthetic chemicals" : "Freshly harvested from a nearby family farm"} and delivered with its story intact.`,
      price,
      unit,
      quantity,
      location: farmer.location,
      harvestDate: `2026-08-${String(31 - (index % 9)).padStart(2, "0")}`,
      image: productImages[imageIndex],
      organic,
      available: true,
      farmerId: farmer.id,
      farmerName: farmer.name,
      rating: Number((4.4 + ((index * 7) % 5) / 10).toFixed(1)),
      reviews: 24 + index * 13,
      createdAt: `2026-08-${String(31 - (index % 12)).padStart(2, "0")}`,
    };
  },
);

const orderItemsFor = (index: number): OrderItem[] => {
  const first = products[index % products.length];
  const second = products[(index * 3 + 4) % products.length];
  return [
    {
      productId: first.id,
      productName: first.name,
      farmerId: first.farmerId,
      farmerName: first.farmerName,
      quantity: 1 + (index % 3),
      unit: first.unit,
      price: first.price,
      image: first.image,
    },
    {
      productId: second.id,
      productName: second.name,
      farmerId: second.farmerId,
      farmerName: second.farmerName,
      quantity: 1 + (index % 2),
      unit: second.unit,
      price: second.price,
      image: second.image,
    },
  ];
};
const orderStatuses: OrderStatus[] = [
  "delivered",
  "in_transit",
  "preparing",
  "confirmed",
  "ready",
  "picked_up",
  "delivered",
  "placed",
  "in_transit",
  "delivered",
  "confirmed",
  "preparing",
  "delivered",
  "ready",
  "in_transit",
];
function calculateDeliveryFee(subtotal: number): number {
  if (!subtotal || subtotal <= 0) return 0;
  if (subtotal >= 250) return 0;
  if (subtotal < 50) return 10;
  if (subtotal < 150) return 15;
  return 20;
}

const orders: Order[] = Array.from({ length: 15 }, (_, index) => {
  const customer = customers[index % customers.length];
  const items = orderItemsFor(index);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(subtotal);
  return {
    id: `FD-2026-${String(1001 + index)}`,
    customerId: customer.id,
    customerName: customer.name,
    items,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    address: customer.address ?? "Lake View Road",
    city: customer.location,
    pinCode: `5000${10 + index}`,
    instructions: index % 3 === 0 ? "Please call on arrival." : "",
    paymentMethod: index % 2 === 0 ? "Cash on Delivery" : "Demo UPI",
    date: `2026-08-${String(31 - (index % 13)).padStart(2, "0")}`,
    estimatedDelivery: "15–20 mins (Express Local Delivery)",
    status: orderStatuses[index],
  };
});

const route: IRouter = Router();

const publicProduct = (product: Product) => product;
const publicProfile = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  location: user.location,
  farmName: user.farmName ?? "",
  farmingType: user.farmingType ?? "",
  address: user.address ?? "",
  products: products.filter((product) => product.farmerId === user.id).length,
});
const error = (res: Parameters<Parameters<typeof route.get>[1]>[1], status: number, message: string) =>
  res.status(status).json({ error: message });

route.post("/login", (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) return error(res, 400, "Please enter an email, password, and role.");
  const user = users.find(
    (candidate) =>
      candidate.email.toLowerCase() === parsed.data.email.toLowerCase() &&
      candidate.password === parsed.data.password &&
      candidate.role === parsed.data.role,
  );
  if (!user) return error(res, 401, "Those credentials do not match the selected role.");
  req.log.info({ userId: user.id, role: user.role }, "Demo user logged in");
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
    },
    message: `Welcome back, ${user.name}`,
  });
});

route.get("/products", (req, res) => {
  const organicQuery = req.query.organic;
  const parsed = GetProductsQueryParams.safeParse({
    ...req.query,
    organic:
      organicQuery === "true" ? true : organicQuery === "false" ? false : organicQuery,
  });
  if (!parsed.success) return error(res, 400, "Invalid marketplace filters.");
  const { search, category, organic, location, sort } = parsed.data;
  let result = products.filter((product) => product.available);
  if (search) {
    const needle = search.toLowerCase();
    result = result.filter((product) => product.name.toLowerCase().includes(needle));
  }
  if (category && category !== "all") result = result.filter((product) => product.category === category);
  if (organic !== undefined) result = result.filter((product) => product.organic === organic);
  if (location && location !== "all") result = result.filter((product) => product.location === location);
  if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
  if (sort === "popular") result.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
  if (sort === "recent") result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(result.map(publicProduct));
});

route.get("/products/:id", (req, res) => {
  const product = products.find((candidate) => candidate.id === req.params.id);
  if (!product) return error(res, 404, "Product not found.");
  return res.json(publicProduct(product));
});

route.post("/products", (req, res) => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) return error(res, 400, "Please complete all product fields with valid values.");
  const farmer = farmers.find((candidate) => candidate.id === parsed.data.farmerId);
  if (!farmer) return error(res, 400, "A valid farmer profile is required.");
  const product: Product = {
    id: `p-${productSequence++}`,
    ...parsed.data,
    farmerName: farmer.name,
    rating: 0,
    reviews: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  products.unshift(product);
  return res.status(201).json(product);
});

route.put("/products/:id", (req, res) => {
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) return error(res, 400, "Please provide valid product values.");
  const index = products.findIndex((candidate) => candidate.id === req.params.id);
  if (index === -1) return error(res, 404, "Product not found.");
  products[index] = { ...products[index], ...parsed.data };
  return res.json(products[index]);
});

route.delete("/products/:id", (req, res) => {
  const index = products.findIndex((candidate) => candidate.id === req.params.id);
  if (index === -1) return error(res, 404, "Product not found.");
  products.splice(index, 1);
  return res.status(204).send();
});

route.get("/orders", (req, res) => {
  const role = typeof req.query.role === "string" ? req.query.role : undefined;
  const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
  let result = [...orders];
  if (role === "customer" && userId) result = result.filter((order) => order.customerId === userId);
  if (role === "farmer" && userId) {
    result = result.filter((order) => order.items.some((item) => item.farmerId === userId));
  }
  return res.json(result);
});

route.post("/orders", (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success || parsed.data.items.length === 0) return error(res, 400, "Your cart is empty or incomplete.");
  const customer = customers.find((candidate) => candidate.id === parsed.data.customerId);
  if (!customer) return error(res, 400, "A valid customer profile is required.");
  const normalizedItems: OrderItem[] = [];
  for (const item of parsed.data.items) {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product || !product.available) return error(res, 400, `${item.productName} is no longer available.`);
    if (item.quantity <= 0 || item.quantity > product.quantity) return error(res, 400, `There is not enough ${product.name} in stock.`);
    normalizedItems.push({
      productId: product.id,
      productName: product.name,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      quantity: item.quantity,
      unit: product.unit,
      price: product.price,
      image: product.image,
    });
  }
  normalizedItems.forEach((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (product) {
      product.quantity -= item.quantity;
      if (product.quantity === 0) product.available = false;
    }
  });
  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const order: Order = {
    id: `FD-2026-${String(1000 + orderSequence++)}`,
    customerId: customer.id,
    customerName: customer.name,
    items: normalizedItems,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    address: parsed.data.address,
    city: parsed.data.city,
    pinCode: parsed.data.pinCode,
    instructions: parsed.data.instructions,
    paymentMethod: parsed.data.paymentMethod,
    date: new Date().toISOString().slice(0, 10),
    estimatedDelivery: "15–20 mins (Express Local Delivery)",
    status: "placed",
  };
  orders.unshift(order);
  return res.status(201).json(order);
});

route.put("/orders/:id/status", (req, res) => {
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) return error(res, 400, "That order status is not valid.");
  const order = orders.find((candidate) => candidate.id === req.params.id);
  if (!order) return error(res, 404, "Order not found.");
  order.status = parsed.data.status;
  return res.json(order);
});

const history: Record<string, number[]> = {
  Tomatoes: [120, 135, 150, 175, 190],
  Potatoes: [160, 166, 171, 174, 178],
  "Red Onions": [142, 148, 145, 151, 154],
  Rice: [220, 218, 224, 229, 231],
  Wheat: [180, 174, 168, 162, 158],
  Mangoes: [210, 202, 184, 168, 150],
  Bananas: [118, 124, 129, 138, 144],
  Spinach: [62, 70, 76, 84, 96],
  Carrots: [80, 84, 87, 88, 90],
  "Green Peas": [54, 59, 67, 72, 78],
};

route.get("/forecast", (_req, res) => {
  const items = Object.entries(history).map(([product, values]) => {
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const growth = (values[values.length - 1] - values[0]) / values[0];
    const recentGrowth = values[values.length - 1] / values[values.length - 2];
    const predicted = Math.round(average * recentGrowth * (1 + growth * 0.35));
    const classification = predicted > 170 ? "high" : predicted > 95 ? "medium" : "low";
    const trend = growth > 0.1 ? "increasing" : growth < -0.08 ? "decreasing" : "stable";
    const recommendation =
      classification === "high"
        ? `Increase ${product.toLowerCase()} inventory by approximately ${Math.max(10, Math.round(growth * 100))}%.`
        : classification === "low"
          ? `Avoid excess ${product.toLowerCase()} stock to reduce wastage.`
          : `Maintain current ${product.toLowerCase()} inventory levels and monitor weekly.`;
    return {
      product,
      currentDemand: values[values.length - 1],
      predictedDemand: predicted,
      growth: Number((growth * 100).toFixed(1)),
      classification,
      trend,
      recommendation,
      history: values.map((actual, index) => ({
        label: `W${index + 1}`,
        actual,
        predicted: index === values.length - 1 ? predicted : 0,
      })),
    };
  });
  return res.json({
    items,
    summary: {
      high: items.filter((item) => item.classification === "high").length,
      increasing: items.filter((item) => item.trend === "increasing").length,
      low: items.filter((item) => item.classification === "low").length,
      recommendedStock: items.filter((item) => item.classification === "high").reduce((sum, item) => sum + item.predictedDemand, 0),
    },
  });
});

route.get("/analytics", (_req, res) => {
  const monthlySales = [
    { month: "Apr", sales: 18200, orders: 38 },
    { month: "May", sales: 21400, orders: 44 },
    { month: "Jun", sales: 24850, orders: 52 },
    { month: "Jul", sales: 29100, orders: 61 },
    { month: "Aug", sales: 34240, orders: 74 },
  ];
  return res.json({
    monthlySales,
    categorySales: [
      { category: "Vegetables", value: 42 },
      { category: "Fruits", value: 24 },
      { category: "Grains", value: 18 },
      { category: "Spices", value: 10 },
      { category: "Pulses", value: 6 },
    ],
    totalSales: monthlySales[monthlySales.length - 1].sales,
    averageOrder: Math.round(monthlySales[monthlySales.length - 1].sales / monthlySales[monthlySales.length - 1].orders),
    growth: 17.7,
  });
});

route.get("/logistics", (_req, res) => {
  return res.json({
    activeDeliveries: 12,
    onTimeRate: 94,
    milesSaved: 38,
    stops: [
      { name: "Gachibowli cluster", location: "West Hyderabad", orders: 5, eta: "10:20 AM", status: "Next stop" },
      { name: "Kukatpally cluster", location: "North Hyderabad", orders: 4, eta: "11:45 AM", status: "Optimized" },
      { name: "Secunderabad cluster", location: "East Hyderabad", orders: 3, eta: "1:10 PM", status: "On route" },
    ],
  });
});

route.get("/profiles/:id", (req, res) => {
  const user = users.find((candidate) => candidate.id === req.params.id);
  if (!user) return error(res, 404, "Profile not found.");
  return res.json(publicProfile(user));
});

route.put("/profiles/:id", (req, res) => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) return error(res, 400, "Please provide valid profile details.");
  const user = users.find((candidate) => candidate.id === req.params.id);
  if (!user) return error(res, 404, "Profile not found.");
  Object.assign(user, parsed.data);
  return res.json(publicProfile(user));
});

export default route;