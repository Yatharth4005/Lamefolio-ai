import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { DatabaseService } from './database.service.js';

export class BillingService {
  private razorpay: any;
  private db = new DatabaseService();

  constructor() {
    if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      });
    }
  }

  async createOrder(handle: string, planId: string) {
    if (!this.razorpay) {
      // For development/preview if keys are missing
      return { 
        id: `order_mock_${Date.now()}`, 
        amount: planId === 'pro' ? 100 : 200, 
        currency: 'INR',
        mock: true 
      };
    }

    const amount = planId === 'pro' ? 100 : 200; // ₹1 and ₹2 (paise)

    const options = {
      amount: amount, // Razorpay already expects paise
      currency: 'INR',
      receipt: `receipt_${handle}_${Date.now()}`,
      notes: {
        userId: handle,
        plan: planId
      }
    };

    const order = await this.razorpay.orders.create(options);
    return order;
  }

  async verifyPayment(handle: string, planId: string, orderId: string, paymentId: string, signature: string) {
    if (!this.razorpay) {
      // Mock verification for development
      await this.upgradeUserPlan(handle, planId);
      return { success: true, message: 'Mock payment verified successfully' };
    }

    const text = orderId + '|' + paymentId;
    const generated_signature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (generated_signature === signature) {
      await this.upgradeUserPlan(handle, planId);
      return { success: true, message: 'Payment verified successfully' };
    }

    throw new Error('Invalid payment signature');
  }

  private async upgradeUserPlan(handle: string, planId: string) {
    console.log(`💎 Upgrading user ${handle} to plan: ${planId}`);
    
    // Update plan and reset points (optional, or set to high number)
    // PRO plan gets 99, PREMIUM 999
    const points = planId.toLowerCase() === 'pro' ? 99 : 999;
    
    await this.db.updateUserPlan(handle, planId.charAt(0).toUpperCase() + planId.slice(1), points);
  }
}
