import React, { useState, useEffect } from 'react';
import api from "../../utils/axios";
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MdPayment, MdDownload, MdCheckCircle } from 'react-icons/md';

export default function MyBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const { darkMode, user } = useAuth();

  useEffect(() => {
    fetchBills();
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get('/bill/my');
      setBills(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch bills');
    }
  };

  const handlePayment = async (bill) => {
    setLoading(true);
    try {
      // 1. Create order
      const orderRes = await api.post('/bill/pay', { billId: bill._id, amount: bill.amount });

      if (!window.Razorpay) {
        toast.error('Razorpay SDK not loaded');
        setLoading(false);
        return;
      }

      const options = {
        key: orderRes.data.key,
        amount: bill.amount * 100,
        currency: "INR",
        name: "SocietyLite",
        description: `Bill for ${bill.month}`,
        order_id: orderRes.data.orderId,
        handler: async function (response) {
          // 2. Verify payment
          try {
            await api.post('/bill/verify', {
              billId: bill._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            toast.success('Payment successful!');
            fetchBills();
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: "#4F46E5"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment failed');
    }
    setLoading(false);
  };

  const handleDownloadReceipt = (bill) => {
    const receipt = `
      SocietyLite - Payment Receipt

      Bill ID: ${bill._id}
      Resident: ${user?.name}
      Flat No: ${user?.flatNo}
      Month: ${bill.month}
      Amount: ₹${bill.amount}
      Status: ${bill.status}
      Paid At: ${new Date(bill.paidAt).toLocaleString()}
      Payment ID: ${bill.razorpayPaymentId}
    `;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${bill.month}.txt`;
    a.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        My Bills
      </h1>

      <div className="dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        {bills.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No bills found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Admin will generate your maintenance bill soon</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Month</th>
                  <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Amount</th>
                  <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Due Date</th>
                  <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Status</th>
                  <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-3 text-gray-900 dark:text-gray-200 font-medium">{bill.month}</td>
                    <td className="p-3 text-gray-900 dark:text-gray-200 font-bold">₹{bill.amount}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{new Date(bill.dueDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${bill.status === 'Paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {bill.status === 'Paid' && <MdCheckCircle />} {bill.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {bill.status === 'Unpaid' ? (
                        <button
                          onClick={() => handlePayment(bill)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                          <MdPayment /> Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDownloadReceipt(bill)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <MdDownload /> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}