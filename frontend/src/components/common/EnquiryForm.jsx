import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const EnquiryForm = ({ vehicle, sellerEmail }) => {
    const [status, setStatus] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            e.target,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
            .then(() => {
                setStatus('Message Sent Successfully!');
                e.target.reset();
            }, () => {
                setStatus('Failed to send message. Please try again.');
            });
    };

    return (
        <div className="p-4 bg-white rounded shadow-sm border">
            <h6>Contact Seller</h6>
            <form onSubmit={sendEmail}>
                {/* Hidden fields for EmailJS template variables */}
                <input type="hidden" name="to_email" value={sellerEmail} />
                <input type="hidden" name="vehicle_name" value={`${vehicle.make} ${vehicle.model}`} />

                <div className="mb-3">
                    <input type="text" name="from_name" className="form-control" placeholder="Your Name" required />
                </div>
                <div className="mb-3">
                    <input type="email" name="from_email" className="form-control" placeholder="Your Email" required />
                </div>
                <div className="mb-3">
                    <textarea name="message" className="form-control" rows="3" placeholder="I'm interested in this car..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Send Enquiry</button>
                {status && <div className={`mt-2 small ${status.includes('Successfully') ? 'text-success' : 'text-danger'}`}>{status}</div>}
            </form>
        </div>
    );
};

export default EnquiryForm;
