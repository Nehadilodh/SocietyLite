import React from 'react'

export default function MyBills() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        My Bills
      </h1>

      <div className=" dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Bill ID</th>
              <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Month</th>
              <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Amount</th>
              <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Status</th>
              <th className="p-3 text-gray-700 dark:text-gray-200 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 text-gray-900 dark:text-gray-200">#BILL001</td>
              <td className="p-3 text-gray-900 dark:text-gray-200">May 2026</td>
              <td className="p-3 text-gray-900 dark:text-gray-200">₹5000</td>
              <td className="p-3 text-red-500 font-medium">Unpaid</td>
              <td className="p-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  Pay Now
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
          Razorpay integration pending
        </p>
      </div>
    </div>
  )
}