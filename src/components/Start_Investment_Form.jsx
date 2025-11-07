// import React from 'react'
// import { motion } from "framer-motion";

// const Start_Investment_Form = () => {
//     return (
//         <div>

//             <motion.div
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, ease: "easeOut" }}
//                 className="bg-white p-10 rounded-xl shadow-2xl max-w-4xl mx-auto my-12"
//             >
//                 <motion.h3
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className="text-4xl font-extrabold mb-6 text-center text-blue-700"
//                 >
//                     Investment Request
//                 </motion.h3>

//                 <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                     className="mb-10 text-gray-600 text-center leading-relaxed"
//                 >
//                     Simplify and expedite your investment request process by submitting proposals, documents, and materials securely online. Our team will review and respond promptly to support your investment journey.
//                 </motion.p>

//                 <form className="space-y-6">
//                     <h6 className="text-xl font-semibold text-gray-800">Send Us An Investment Request</h6>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <input type="text" name="name" placeholder="Name" required className="input-field p-1 mx-3" />
//                         <input type="email" name="email" placeholder="Email" required className="input-field p-1 mx-3" />
//                         <input type="number" name="phone" placeholder="Phone No" required className="input-field p-1 mx-3" />
//                         <input type="text" name="company" placeholder="Company Name" required className="input-field p-1 mx-3" />
//                         <input type="text" name="location" placeholder="Company Location" required className="input-field p-1 mx-3" />
//                         <input type="text" name="sector" placeholder="Sector" required className="input-field p-1 mx-3" />
//                         <input type="date" name="year" placeholder="Years In Operation" required className="input-field p-1 mx-3" />
//                         <input type="number" name="amount" placeholder="Amount Requested" required className="input-field p-1 mx-3" />
//                     </div>

//                     <div>
//                         <label htmlFor="reason" className="block text-gray-700 font-medium mb-1">
//                             Reason For Investment
//                         </label>
//                         <textarea
//                             name="reason"
//                             rows="4"
//                             placeholder="Describe your need for investment..."
//                             className="input-field resize-none w-full border"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="file" className="block text-gray-700 font-medium mb-1">
//                             Attach Your Pitch Deck
//                         </label>
//                         <input
//                             type="file"
//                             name="file"
//                             id="file"
//                             className="w-full text-gray-700 border border-gray-300 rounded px-3 py-2 bg-white hover:border-blue-500 transition duration-300"
//                         />
//                     </div>

//                     <div className="text-center pt-4">
//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.97 }}
//                             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md"
//                             type="submit"
//                         >
//                             Send Request
//                         </motion.button>
//                     </div>
//                 </form>
//             </motion.div>

//         </div>
//     )
// }

// export default Start_Investment_Form


import React, { useContext, useEffect, useState } from 'react';
import { InvestmentContext } from '../contexts/InvestmentContext';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const Start_Investment_Form = () => {
    const { cartItems, removeFromCart } = useContext(InvestmentContext);
    const [investmentAmounts, setInvestmentAmounts] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [walletType, setWalletType] = useState('');
    const [bankName, setBankName] = useState('');
    const [walletBalance, setWalletBalance] = useState(50000);
    const [bankBalance, setBankBalance] = useState(100000);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsed = JSON.parse(user);
                setFormData(prev => ({
                    ...prev,
                    name: parsed.fullName || '',
                    email: parsed.email || '',
                    phone: parsed.phone || '',
                }));
            } catch (err) {
                console.error("Error parsing user:", err);
            }
        }
    }, []);

    const totalAmount = Object.values(investmentAmounts).reduce(
        (acc, val) => acc + (parseFloat(val) || 0),
        0
    );

    const handleInvestmentChange = (projectId, amount) => {
        setInvestmentAmounts(prev => ({
            ...prev,
            [projectId]: amount
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const validateForm = () => {
        const baseValid = ['name', 'email', 'phone']
            .every(key => formData[key]);

        if (paymentMethod === 'wallet' && !walletType) return false;
        if (paymentMethod === 'bank' && !bankName) return false;

        return baseValid;
    };

    const handleProceed = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        if (!validateForm()) {
            alert("Please complete all required fields.");
            return;
        }
        if (Object.keys(investmentAmounts).length === 0) {
            alert("Please enter an amount for at least one project.");
            return;
        }
        if (
            (paymentMethod === 'wallet' && totalAmount > walletBalance) ||
            (paymentMethod === 'bank' && totalAmount > bankBalance)
        ) {
            alert("Insufficient balance.");
            return;
        }

        alert(`Successfully invested रु${totalAmount} via ${paymentMethod.toUpperCase()} ${paymentMethod === 'wallet' ? `(${walletType})` : `(${bankName})`}.`);

        // Deduct balance
        if (paymentMethod === 'wallet') {
            setWalletBalance(prev => prev - totalAmount);
        } else {
            setBankBalance(prev => prev - totalAmount);
        }

        // Remove one quantity of each invested project
        Object.entries(investmentAmounts).forEach(([projectId, amount]) => {
            if (parseFloat(amount) > 0) {
                removeFromCart(projectId);
            }
        });

        // Reset form
        setInvestmentAmounts({});
        setFormData({
            name: '',
            email: '',
            phone: '',
            // company: '',
            // location: '',
            // sector: '',
            // year: '',
            // amount: '',
            // reason: '',
            // file: null
        });

        setWalletType('');
        setBankName('');

        navigate('/profile');
    };

    // Helper: Unique projects (one card per unique project)
    const uniqueProjects = Array.from(
        new Map(cartItems.map(item => [item.project._id, item])).values()
    );

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-4xl text-center font-bold mb-6">Investment Checkout</h2>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white p-5 rounded-xl shadow-2xl max-w-5xl mx-auto my-2"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="border px-4 py-2 rounded" />
                                <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="border px-4 py-2 rounded" />
                                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone No" className="border px-4 py-2 rounded" />
                                <p className="text-xl font-semibold border px-4 py-2 rounded">Total: रु.{totalAmount}</p>

                                {uniqueProjects.map(item => (
                                    <div key={item.project._id} className="border p-4 rounded shadow">
                                        <h3 className="text-lg font-semibold">{item.project?.title}</h3>
                                        <p className="text-sm text-gray-500">{item.project?.category}</p>
                                        <label className="block mt-2 mb-1 text-sm">Enter Investment Amount (रु)</label>
                                        <input
                                            type="number"
                                            className="border rounded px-3 py-2 w-full"
                                            min="0"
                                            value={investmentAmounts[item.project?._id] || ''}
                                            onChange={(e) => handleInvestmentChange(item.project?._id, e.target.value)}
                                        />
                                    </div>
                                ))}

                                <div className="border p-4 rounded shadow">
                                    <label className="block mb-2 font-medium">Select Payment Method</label>
                                    <select
                                        className="border px-3 py-2 rounded w-full mb-2"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="wallet">Wallet (रु.{walletBalance})</option>
                                        <option value="bank">Bank Account (रु.{bankBalance})</option>
                                    </select>

                                    {paymentMethod === 'wallet' && (
                                        <select
                                            className="border px-3 py-2 rounded w-full"
                                            value={walletType}
                                            onChange={(e) => setWalletType(e.target.value)}
                                        >
                                            <option value="">Select Wallet Provider</option>
                                            <option value="esewa">eSewa</option>
                                            <option value="khalti">Khalti</option>
                                            <option value="imepay">IME Pay</option>
                                        </select>
                                    )}

                                    {paymentMethod === 'bank' && (
                                        <select
                                            className="border px-3 py-2 rounded w-full"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                        >
                                            <option value="">Select Bank</option>
                                            <option value="nabil">Nabil Bank</option>
                                            <option value="nic">NIC Asia</option>
                                            <option value="global">Global IME Bank</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        </form>
                    </motion.div>

                    <div className="text-right me-5 max-w-md justify-items-end">
                        {Object.entries(investmentAmounts).map(([projectId, amount]) => {
                            const item = uniqueProjects.find(ci => ci.project?._id === projectId);
                            if (!item || !item.project) return null;

                            return (
                                <div key={projectId} className="border p-4 rounded shadow max-w-md bg-white">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.project.title}</h3>
                                    <p className="text-sm text-gray-600">Invested Amount (रु): {parseFloat(amount).toLocaleString()}</p>
                                </div>
                            );
                        })}
                        <p className="text-xl font-semibold mb-4 ">Total: रु.{totalAmount}</p>
                        <button
                            onClick={handleProceed}
                            disabled={!validateForm() || totalAmount <= 0}
                            className={`bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition ${(!validateForm() || totalAmount <= 0) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            CONFIRM INVESTMENT
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Start_Investment_Form;






