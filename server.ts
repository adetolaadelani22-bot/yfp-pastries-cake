import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db';
import { Order, OrderStatus, Product, CustomCakeRequest, CateringRequest, Review, ContactMessage, Coupon } from './src/types';

export async function createApp() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), platform: 'YFP Pastries & Cakes' });
  });

  // ==========================================
  // PRODUCTS API
  // ==========================================
  app.get('/api/products', (req, res) => {
    let products = db.get('products');
    const { category, search, sort, minPrice, maxPrice, availability, featured, bestseller } = req.query;

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    if (availability && availability !== 'all') {
      products = products.filter(p => p.availability === availability);
    }

    if (featured === 'true') {
      products = products.filter(p => p.isFeatured);
    }

    if (bestseller === 'true') {
      products = products.filter(p => p.isBestseller);
    }

    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popular') {
      products.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    res.json(products);
  });

  app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const products = db.get('products');
    const product = products.find(p => p.id === id || p.slug === id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const related = products
      .filter(p => p.id !== product.id && (p.category === product.category || p.isBestseller))
      .slice(0, 4);

    res.json({ product, related });
  });

  const isAuthorizedStaffOrAdmin = (req: any) => {
    const roleHeader = String(req.headers['x-user-role'] || req.headers['authorization'] || '').toLowerCase();
    return roleHeader.includes('admin') || roleHeader.includes('staff');
  };

  app.post('/api/products', (req, res) => {
    // Security check: Only administrators and staff can create products
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customers are not permitted to add products or images.' });
    }

    const newProduct: Product = {
      ...req.body,
      id: 'prod-' + Date.now(),
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const products = db.get('products');
    products.unshift(newProduct);
    db.set('products', products);

    db.logAudit('Admin', 'CREATE_PRODUCT', 'Products', `Created product ${newProduct.name} at ₦${newProduct.price}`);
    res.status(201).json(newProduct);
  });

  const updateProductHandler = (req: any, res: any) => {
    // Security check: Only administrators and staff can update product prices/pictures
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customers are not permitted to edit product prices or upload images.' });
    }

    const { id } = req.params;
    const products = db.get('products');
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    db.set('products', products);

    db.logAudit('Admin', 'UPDATE_PRODUCT', 'Products', `Updated product ${products[index].name}`);
    res.json(products[index]);
  };

  app.put('/api/products/:id', updateProductHandler);
  app.patch('/api/products/:id', updateProductHandler);

  app.delete('/api/products/:id', (req, res) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customers are not permitted to delete products.' });
    }

    const { id } = req.params;
    let products = db.get('products');
    const existing = products.find(p => p.id === id);

    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products = products.filter(p => p.id !== id);
    db.set('products', products);

    db.logAudit('Admin', 'DELETE_PRODUCT', 'Products', `Deleted product ${existing.name}`);
    res.json({ success: true, message: 'Product deleted' });
  });

  // ==========================================
  // CATEGORIES API
  // ==========================================
  app.get('/api/categories', (req, res) => {
    const categories = db.get('categories');
    const products = db.get('products');

    // recalculate counts
    const updated = categories.map(cat => ({
      ...cat,
      itemCount: products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase() && p.active).length
    }));

    res.json(updated);
  });

  app.post('/api/categories', (req, res) => {
    const categories = db.get('categories');
    const newCat = {
      id: 'cat-' + Date.now(),
      slug: req.body.name.toLowerCase().replace(/\s+/g, '-'),
      itemCount: 0,
      active: true,
      ...req.body
    };
    categories.push(newCat);
    db.set('categories', categories);
    db.logAudit('Admin', 'CREATE_CATEGORY', 'Categories', `Created category ${newCat.name}`);
    res.status(201).json(newCat);
  });

  // ==========================================
  // DELIVERY ZONES API
  // ==========================================
  app.get('/api/delivery-zones', (req, res) => {
    res.json(db.get('deliveryZones'));
  });

  app.put('/api/delivery-zones/:id', (req, res) => {
    const { id } = req.params;
    const zones = db.get('deliveryZones');
    const idx = zones.findIndex(z => z.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Zone not found' });

    zones[idx] = { ...zones[idx], ...req.body };
    db.set('deliveryZones', zones);
    db.logAudit('Admin', 'UPDATE_ZONE', 'DeliveryZones', `Updated delivery zone ${zones[idx].name}`);
    res.json(zones[idx]);
  });

  // ==========================================
  // COUPONS API & VALIDATION
  // ==========================================
  app.get('/api/coupons', (req, res) => {
    res.json(db.get('coupons'));
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Please provide a promo code' });
    }

    const coupons = db.get('coupons');
    const coupon = coupons.find(c => c.code.toUpperCase() === String(code).trim().toUpperCase());

    if (!coupon || !coupon.active) {
      return res.status(400).json({ valid: false, message: 'Invalid or expired coupon code' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, message: 'This coupon has expired' });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order of ₦${coupon.minOrderAmount.toLocaleString()} required for this coupon`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    res.json({
      valid: true,
      discountAmount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value
      }
    });
  });

  app.post('/api/coupons', (req, res) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customer accounts do not have access to staff kitchen or admin operations.' });
    }

    const coupons = db.get('coupons');
    const newCoupon: Coupon = {
      id: 'coup-' + Date.now(),
      code: req.body.code.toUpperCase().trim(),
      discountType: req.body.discountType || 'percentage',
      value: Number(req.body.value),
      minOrderAmount: Number(req.body.minOrderAmount || 0),
      maxDiscount: req.body.maxDiscount ? Number(req.body.maxDiscount) : undefined,
      active: true,
      timesUsed: 0
    };
    coupons.push(newCoupon);
    db.set('coupons', coupons);
    db.logAudit('Admin', 'CREATE_COUPON', 'Coupons', `Created coupon code ${newCoupon.code}`);
    res.status(201).json(newCoupon);
  });

  app.delete('/api/coupons/:id', (req, res) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customer accounts do not have access to staff kitchen or admin operations.' });
    }

    let coupons = db.get('coupons');
    coupons = coupons.filter(c => c.id !== req.params.id);
    db.set('coupons', coupons);
    db.logAudit('Admin', 'DELETE_COUPON', 'Coupons', `Deleted coupon ${req.params.id}`);
    res.json({ success: true });
  });

  // ==========================================
  // ORDERS API
  // ==========================================
  app.get('/api/orders', (req, res) => {
    let orders = db.get('orders');
    const { email, status } = req.query;

    if (email) {
      orders = orders.filter(o => o.customer.email.toLowerCase() === String(email).toLowerCase());
    }

    if (status && status !== 'all') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(orders);
  });

  app.get('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const orders = db.get('orders');
    const order = orders.find(o => o.id === id || o.orderNumber === id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    const { customer, deliveryMethod, deliveryDetails, items, couponCode, paymentMethod } = req.body;

    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return res.status(400).json({ error: 'Customer name, email, and phone are required.' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order items cannot be empty.' });
    }

    const products = db.get('products');

    // Server-side recalculation of subtotal and validation
    let subtotal = 0;
    const validatedItems = items.map((item: any) => {
      const prod = products.find(p => p.id === item.productId);
      const unitPrice = item.unitPrice || (prod ? prod.price : 0);
      const qty = Math.max(1, item.quantity || 1);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      return {
        productId: item.productId,
        name: item.name || (prod ? prod.name : 'Bakery Item'),
        image: item.image || (prod ? prod.images[0] : ''),
        unitPrice,
        quantity: qty,
        totalPrice: lineTotal,
        selectedSize: item.selectedSize,
        inscription: item.inscription
      };
    });

    // Calculate delivery fee
    let deliveryFee = 0;
    if (deliveryMethod === 'delivery' && deliveryDetails?.area) {
      const zones = db.get('deliveryZones');
      const zone = zones.find(z => z.name.toLowerCase() === deliveryDetails.area.toLowerCase());
      deliveryFee = zone ? zone.fee : 1500;
    }

    // Calculate discount
    let discountAmount = 0;
    if (couponCode) {
      const coupons = db.get('coupons');
      const coupon = coupons.find(c => c.code.toUpperCase() === String(couponCode).toUpperCase() && c.active);
      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.value) / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.value;
        }
        coupon.timesUsed += 1;
        db.set('coupons', coupons);
      }
    }

    const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);
    const orderNumber = `YFP-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customer,
      deliveryMethod,
      deliveryDetails,
      items: validatedItems,
      subtotal,
      deliveryFee,
      discountAmount,
      couponCode,
      totalAmount,
      paymentMethod: paymentMethod || 'paystack',
      paymentStatus: paymentMethod === 'pay_on_delivery' ? 'pending' : 'pending',
      orderStatus: paymentMethod === 'pay_on_delivery' ? 'order_received' : 'pending_payment',
      timeline: [
        {
          status: paymentMethod === 'pay_on_delivery' ? 'order_received' : 'pending_payment',
          timestamp: new Date().toISOString(),
          note: paymentMethod === 'pay_on_delivery'
            ? 'Order placed with Pay on Delivery. Preparation scheduled.'
            : 'Order initialized, awaiting customer payment verification.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const orders = db.get('orders');
    orders.unshift(newOrder);
    db.set('orders', orders);

    db.logAudit(customer.fullName, 'CREATE_ORDER', 'Orders', `Created order ${orderNumber} for ₦${totalAmount.toLocaleString()}`);

    res.status(201).json(newOrder);
  });

  const updateOrderStatusHandler = (req: any, res: any) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customer accounts do not have access to staff kitchen or admin operations.' });
    }

    const { id } = req.params;
    const status = req.body.status || req.body.orderStatus;
    const note = req.body.note;
    const staffName = req.body.staffName;
    const orders = db.get('orders');
    const order = orders.find(o => o.id === id || o.orderNumber === id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.orderStatus = status as OrderStatus;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      status: status as OrderStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${String(status).replace(/_/g, ' ')}`
    });

    db.set('orders', orders);
    db.logAudit(staffName || 'Staff', 'UPDATE_ORDER_STATUS', 'Orders', `Updated order ${order.orderNumber} status to ${status}`);

    res.json(order);
  };

  app.put('/api/orders/:id/status', updateOrderStatusHandler);
  app.patch('/api/orders/:id/status', updateOrderStatusHandler);

  // ==========================================
  // PAYMENT API (Paystack Integration / Verification)
  // ==========================================
  app.post('/api/payments/initialize', (req, res) => {
    const { orderId, email, amount } = req.body;
    const reference = `PSTK_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    res.json({
      success: true,
      reference,
      amount,
      currency: 'NGN',
      email,
      orderId,
      message: 'Paystack payment initialized successfully'
    });
  });

  app.post('/api/payments/verify', (req, res) => {
    const { reference, orderId } = req.body;
    const orders = db.get('orders');
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found for verification' });
    }

    // Set order as paid and confirmed
    order.paymentStatus = 'paid';
    order.paymentReference = reference;
    order.orderStatus = 'payment_confirmed';
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      status: 'payment_confirmed',
      timestamp: new Date().toISOString(),
      note: `Payment of ₦${order.totalAmount.toLocaleString()} verified via Paystack (Ref: ${reference})`
    });

    // Deduct stock for all items
    const products = db.get('products');
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        if (prod.stockQuantity === 0) {
          prod.availability = 'out_of_stock';
        } else if (prod.stockQuantity < 5) {
          prod.availability = 'low_stock';
        }
      }
    });

    db.set('products', products);
    db.set('orders', orders);

    db.logAudit('PaymentGateway', 'PAYMENT_VERIFIED', 'Payments', `Verified payment for ${order.orderNumber} (Ref: ${reference})`);

    res.json({
      success: true,
      order,
      message: 'Payment verified and inventory updated successfully'
    });
  });

  // ==========================================
  // CUSTOM CAKE BUILDER API
  // ==========================================
  app.get('/api/custom-cakes', (req, res) => {
    let requests = db.get('customCakes');
    const { email } = req.query;

    if (email) {
      requests = requests.filter(r => r.customer.email.toLowerCase() === String(email).toLowerCase());
    }

    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(requests);
  });

  app.post('/api/custom-cakes', (req, res) => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = String(Math.floor(100 + Math.random() * 900));
    const requestId = `YFP-CAKE-${dateStr}-${randNum}`;

    const newRequest: CustomCakeRequest = {
      id: 'cake-' + Date.now(),
      requestId,
      ...req.body,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    const cakes = db.get('customCakes');
    cakes.unshift(newRequest);
    db.set('customCakes', cakes);

    db.logAudit(newRequest.customer.name, 'CUSTOM_CAKE_REQUEST', 'CustomCakes', `Submitted custom cake design request ${requestId}`);
    res.status(201).json(newRequest);
  });

  const updateCustomCakeHandler = (req: any, res: any) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customer accounts do not have access to staff kitchen or admin operations.' });
    }

    const { id } = req.params;
    const cakes = db.get('customCakes');
    const idx = cakes.findIndex(c => c.id === id || c.requestId === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Custom cake request not found' });
    }

    cakes[idx] = { ...cakes[idx], ...req.body };
    db.set('customCakes', cakes);

    db.logAudit('Admin', 'UPDATE_CUSTOM_CAKE', 'CustomCakes', `Updated custom cake request ${cakes[idx].requestId} to ${cakes[idx].status}`);
    res.json(cakes[idx]);
  };

  app.put('/api/custom-cakes/:id', updateCustomCakeHandler);
  app.patch('/api/custom-cakes/:id', updateCustomCakeHandler);
  app.patch('/api/custom-cakes/:id/status', updateCustomCakeHandler);

  // ==========================================
  // CATERING REQUESTS API
  // ==========================================
  app.get('/api/catering', (req, res) => {
    res.json(db.get('cateringRequests'));
  });

  app.post('/api/catering', (req, res) => {
    const requestId = `YFP-CAT-${Date.now().toString().slice(-6)}`;
    const newRequest: CateringRequest = {
      id: 'cat-req-' + Date.now(),
      requestId,
      ...req.body,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const catering = db.get('cateringRequests');
    catering.unshift(newRequest);
    db.set('cateringRequests', catering);

    db.logAudit(newRequest.fullName, 'CATERING_REQUEST', 'Catering', `Submitted catering request for ${newRequest.eventType} (${newRequest.guestCount} guests)`);
    res.status(201).json(newRequest);
  });

  app.put('/api/catering/:id', (req, res) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customer accounts do not have access to staff kitchen or admin operations.' });
    }

    const { id } = req.params;
    const requests = db.get('cateringRequests');
    const idx = requests.findIndex(r => r.id === id || r.requestId === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Catering request not found' });
    }

    requests[idx] = { ...requests[idx], ...req.body };
    db.set('cateringRequests', requests);
    db.logAudit('Admin', 'UPDATE_CATERING', 'Catering', `Updated catering request ${requests[idx].requestId} to ${requests[idx].status}`);
    res.json(requests[idx]);
  });

  // ==========================================
  // REVIEWS API
  // ==========================================
  app.get('/api/reviews', (req, res) => {
    const { productId } = req.query;
    let reviews = db.get('reviews');

    if (productId) {
      reviews = reviews.filter(r => r.productId === productId);
    }

    res.json(reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      ...req.body,
      date: new Date().toISOString().slice(0, 10),
      verifiedPurchase: true
    };

    const reviews = db.get('reviews');
    reviews.unshift(newReview);
    db.set('reviews', reviews);

    // Update product average rating
    const products = db.get('products');
    const prod = products.find(p => p.id === newReview.productId);
    if (prod) {
      const prodReviews = reviews.filter(r => r.productId === prod.id);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewsCount = prodReviews.length;
      db.set('products', products);
    }

    res.status(201).json(newReview);
  });

  // ==========================================
  // CONTACT MESSAGES API
  // ==========================================
  app.get('/api/contact', (req, res) => {
    res.json(db.get('contacts'));
  });

  app.post('/api/contact', (req, res) => {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      ...req.body,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    const contacts = db.get('contacts');
    contacts.unshift(newMsg);
    db.set('contacts', contacts);

    db.logAudit(newMsg.name, 'CONTACT_SUBMISSION', 'Contact', `New message received from ${newMsg.email}`);
    res.status(201).json({ success: true, message: 'Message sent successfully. Our team will contact you shortly.' });
  });

  app.put('/api/contact/:id', (req, res) => {
    const { id } = req.params;
    const contacts = db.get('contacts');
    const idx = contacts.findIndex(c => c.id === id);
    if (idx !== -1) {
      contacts[idx] = { ...contacts[idx], ...req.body };
      db.set('contacts', contacts);
    }
    res.json({ success: true });
  });

  // ==========================================
  // BUSINESS SETTINGS API
  // ==========================================
  app.get('/api/settings', (req, res) => {
    res.json(db.get('settings'));
  });

  app.put('/api/settings', (req, res) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customer accounts do not have access to staff kitchen or admin operations.' });
    }

    const current = db.get('settings');
    const updated = { ...current, ...req.body };
    db.set('settings', updated);
    db.logAudit('Admin', 'UPDATE_SETTINGS', 'Settings', 'Updated bakery business settings');
    res.json(updated);
  });

  // ==========================================
  // ADMIN STATS & AUDIT LOGS
  // ==========================================
  app.get('/api/admin/stats', (req, res) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customer accounts do not have access to staff kitchen or admin operations.' });
    }

    const orders = db.get('orders');
    const products = db.get('products');
    const customCakes = db.get('customCakes');
    const catering = db.get('cateringRequests');

    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'order_received' || o.orderStatus === 'preparing').length;
    const lowStockProducts = products.filter(p => p.stockQuantity < 10);

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      paidOrdersCount: orders.filter(o => o.paymentStatus === 'paid').length,
      pendingOrdersCount: pendingOrders,
      customCakesCount: customCakes.length,
      cateringCount: catering.length,
      lowStockProducts,
      recentOrders: orders.slice(0, 5)
    });
  });

  app.get('/api/admin/audit-logs', (req, res) => {
    if (!isAuthorizedStaffOrAdmin(req)) {
      return res.status(403).json({ error: 'Access denied: Customer accounts do not have access to staff kitchen or admin operations.' });
    }

    res.json(db.get('auditLogs'));
  });

  // ==========================================
  // AUTH API (Demonstration / Production Ready)
  // ==========================================
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@yfpbakery.ng' && password === 'admin123') {
      return res.json({
        user: {
          id: 'usr-admin-1',
          name: 'Yatex Bakare (Admin)',
          email: 'admin@yfpbakery.ng',
          role: 'admin'
        },
        token: 'yfp_secure_admin_session_token'
      });
    }

    if (email === 'staff@yfpbakery.ng' && password === 'staff123') {
      return res.json({
        user: {
          id: 'usr-staff-1',
          name: 'Ibrahim Bello (Kitchen Lead)',
          email: 'staff@yfpbakery.ng',
          role: 'staff'
        },
        token: 'yfp_secure_staff_session_token'
      });
    }

    // Check if user exists in database
    const users = (db.get('users') || []) as any[];
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      return res.json({
        user: foundUser,
        token: 'yfp_secure_cust_token_' + foundUser.id
      });
    }

    // Standard customer login
    if (email && password) {
      const newUser = {
        id: 'usr-cust-' + Date.now(),
        name: email.split('@')[0],
        email,
        phone: '07064918034',
        role: 'customer' as const,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      db.set('users', users);

      return res.json({
        user: newUser,
        token: 'yfp_secure_cust_' + Date.now()
      });
    }

    return res.status(401).json({ error: 'Invalid email or password' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email address, and password are required' });
    }

    const users = (db.get('users') || []) as any[];
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    const newUser = {
      id: 'usr-cust-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      role: 'customer' as const,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    db.set('users', users);
    db.logAudit(newUser.name, 'REGISTER_CUSTOMER', 'Auth', `New customer account registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      user: newUser,
      token: 'yfp_secure_cust_' + Date.now(),
      message: 'Account created successfully! Welcome to YFP Pastries & Cakes.'
    });
  });

  // ==========================================
  // Static Assets & Vite Middleware Handling
  // ==========================================
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (process.env.VERCEL !== '1') {
  createApp().then((app) => {
    app.listen(3000, '0.0.0.0', () => {
      console.log('YFP Pastries & Cakes server listening on http://0.0.0.0:3000');
    });
  });
}
